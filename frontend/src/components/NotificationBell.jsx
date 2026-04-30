import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// Maps notification type to colors and styles
const typeConfig = {
  reservation: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  cancellation: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    dot: 'bg-rose-500',
  },
  rejection: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    dot: 'bg-red-600',
  },
  confirmation: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    dot: 'bg-amber-500',
  },
  expiry: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    dot: 'bg-orange-500',
  },
  stock: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    iconBg: 'bg-teal-100',
    dot: 'bg-teal-500',
  },
};

const formatTime = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationBell = () => {
  const { notifications: allNotifications, markNotificationRead, markAllRead, clearNotifications } = useAppContext();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Filter notifications for the current user
  const userRole = user?.role === 'admin' || user?.role === 'dealer' ? 'admin' : 'user';
  const notifications = allNotifications.filter(n => n.recipientRole === userRole);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Notifications"
      >
        {/* Bell icon */}
        <svg
          className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-emerald-600' : 'text-slate-500'} group-hover:text-emerald-600`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-14 w-96 bg-white rounded-[28px] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
            <div>
              <h3 className="font-black text-slate-900 text-base">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs font-bold text-slate-400 mt-0.5">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                <p className="text-xs text-slate-300 mt-1">Reservations and updates will appear here</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const cfg = typeConfig[notif.type] || typeConfig.stock;
                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${!notif.read ? cfg.bg : 'bg-white'}`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 ${cfg.iconBg} rounded-2xl flex items-center justify-center text-lg`}>
                      {notif.icon || '🔔'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-black leading-tight ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.read && (
                      <div className={`flex-shrink-0 w-2.5 h-2.5 ${cfg.dot} rounded-full mt-1`} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
