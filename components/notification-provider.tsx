"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  getStoredNotifications, 
  createSystemNotification, 
  markNotificationRead, 
  markAllNotificationsRead,
  deleteNotification as deleteNotificationFromDb,
  clearAllNotifications as clearNotificationsFromDb,
  getStoredUserSettings,
  syncStoredNotifications,
} from '@/lib/api';
import { showToast } from '@/lib/toast';

export type NotificationType = 'task_assigned' | 'due_date' | 'comment' | 'status_change' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date | string;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredNotifications());
  const knownIds = useRef<Set<string>>(new Set(getStoredNotifications().map(item => item.id)));

  useEffect(() => {
    const loadFromDb = () => {
      const dbItems = getStoredNotifications();
      setNotifications(dbItems);
      const currentIds = new Set(dbItems.map(item => item.id));
      const incoming = dbItems.filter(item => !knownIds.current.has(item.id) && !item.read);
      knownIds.current = currentIds;
      if (getStoredUserSettings().pushNotifications) {
        incoming.forEach(item => {
          showToast('notification', item.title, item.message);
          playNotificationBeep();
        });
      }
    };

    const handleDbUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'notifications') {
        loadFromDb();
      }
    };
    window.addEventListener('klarity_db_update', handleDbUpdate);
    window.addEventListener('klarity_db_update', handleDbUpdate);
    const poll = window.setInterval(() => {
      void syncStoredNotifications().catch(error => {
        console.error('Unable to check for incoming notifications:', error);
      });
    }, 20000);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener('klarity_db_update', handleDbUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const created = createSystemNotification({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link
    });
    setNotifications(prev => [created, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(markAllNotificationsRead());
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(deleteNotificationFromDb(id));
  }, []);

  const clearAll = useCallback(() => {
    clearNotificationsFromDb();
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

function playNotificationBeep(): void {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(context.destination);
  void context.resume().then(() => {
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
    oscillator.addEventListener('ended', () => void context.close(), { once: true });
  }).catch(() => {
    void context.close();
  });
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
