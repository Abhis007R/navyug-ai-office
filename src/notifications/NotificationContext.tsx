// ========================================
// File: src/notifications/NotificationContext.tsx
// ========================================

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { Notification } from "./types";

interface NotificationContextValue {
  notifications: Notification[];

  addNotification: (notification: Notification) => void;

  removeNotification: (id: string) => void;

  markAsRead: (id: string) => void;

  clearNotifications: () => void;
}

const NotificationContext =
  createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {

    setNotifications(prev => [
      notification,
      ...prev,
    ]);

  };

  const removeNotification = (id: string) => {

    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );

  };

  const markAsRead = (id: string) => {

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, read: true }
          : n
      )
    );

  };

  const clearNotifications = () => {

    setNotifications([]);

  };

  return (

    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>

  );

}

export function useNotifications() {

  const context = useContext(NotificationContext);

  if (!context) {

    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );

  }

  return context;

}