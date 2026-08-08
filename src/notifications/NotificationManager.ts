// ========================================
// File: src/notifications/NotificationManager.ts
// ========================================

import { Notification } from "./types";

class NotificationManager {

  private notifications: Notification[] = [];

  add(notification: Notification) {
    this.notifications.unshift(notification);
  }

  getAll(): Notification[] {
    return this.notifications;
  }

  getUnread(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);

    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => {
      n.read = true;
    });
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(
      n => n.id !== id
    );
  }

  clear() {
    this.notifications = [];
  }

  countUnread(): number {
    return this.notifications.filter(n => !n.read).length;
  }

}

export const notificationManager = new NotificationManager();