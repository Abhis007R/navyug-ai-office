// ========================================
// File: src/notifications/NotificationCenter.tsx
// ========================================

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { useNotifications } from "./NotificationContext";

export default function NotificationCenter() {
  const {
    notifications,
    markAsRead,
    clearNotifications,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-slate-100"
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white border rounded-xl shadow-xl z-50">

          <div className="flex items-center justify-between p-4 border-b">

            <h2 className="font-semibold">
              Notifications
            </h2>

            <button
              onClick={clearNotifications}
              className="text-sm text-red-500"
            >
              Clear
            </button>

          </div>

          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (

              <div className="p-6 text-center text-slate-500">
                No notifications
              </div>

            ) : (

              notifications.map(notification => (

                <div
                  key={notification.id}
                  className={`p-4 border-b cursor-pointer ${
                    notification.read
                      ? "bg-white"
                      : "bg-blue-50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >

                  <div className="flex gap-3">

                    {getIcon(notification.type)}

                    <div className="flex-1">

                      <h3 className="font-medium">
                        {notification.title}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {notification.message}
                      </p>

                      <div className="text-xs text-slate-400 mt-1">
                        {notification.createdAt.toLocaleString()}
                      </div>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      )}

    </div>
  );
}