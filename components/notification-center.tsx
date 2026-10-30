import React, { useState, useEffect } from 'react';
import { Bell, Trash2, X, Info, UserPlus, Clock, MessageSquare, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useNotifications, NotificationType } from './notification-provider';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'task_assigned': return <UserPlus size={16} className="text-blue-500" />;
    case 'due_date': return <Clock size={16} className="text-orange-500" />;
    case 'comment': return <MessageSquare size={16} className="text-purple-500" />;
    case 'status_change': return <RefreshCw size={16} className="text-green-500" />;
    default: return <Info size={16} className="text-gray-500" />;
  }
};

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications();
  
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Tout marquer comme lu
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={clsx(
                    "p-4 transition-colors relative group",
                    notification.read ? "opacity-75" : "bg-indigo-50/30 dark:bg-indigo-500/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={clsx(
                          "text-sm font-medium truncate",
                          notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"
                        )}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap" suppressHydrationWarning>
                          {mounted ? (() => {
                            const diffInMinutes = Math.round((notification.timestamp.getTime() - now) / (1000 * 60));
                            return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(diffInMinutes, 'minute');
                          })() : 'À l\'instant'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Marquer comme lu
                          </button>
                        )}
                        <a href={notification.link} className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:underline">
                          Voir les détails
                        </a>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="absolute top-4 right-4 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucune notification pour le moment.</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-center">
            <button 
              onClick={clearAll}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <Trash2 size={12} />
              Tout effacer
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
