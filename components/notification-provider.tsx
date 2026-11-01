"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getStoredNotifications, 
  createSystemNotification, 
  markNotificationRead, 
  markAllNotificationsRead,
  deleteNotification as deleteNotificationFromDb,
  clearAllNotifications as clearNotificationsFromDb, 
  NotificationItem 
} from '@/lib/api';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from database on mount and listen for real-time storage updates
  useEffect(() => {
    const loadFromDb = () => {
      const dbItems = getStoredNotifications();
      setNotifications(dbItems);
    };

    loadFromDb();

    const handleDbUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === 'notifications') {
        loadFromDb();
      }
    };

    window.addEventListener('klarity_db_update', handleDbUpdate);
    return () => window.removeEventListener('klarity_db_update', handleDbUpdate);
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

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
