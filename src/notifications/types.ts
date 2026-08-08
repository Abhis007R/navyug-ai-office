// ========================================
// File: src/notifications/types.ts
// ========================================

export type NotificationType =
  | "success"
  | "warning"
  | "info"
  | "error";

export interface Notification {
  id: string;

  title: string;

  message: string;

  type: NotificationType;

  createdAt: Date;

  read: boolean;

  source?: string;

  action?: string;

  payload?: any;
}