import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, XCircle, Info, Clock, Trash2 } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import type { NotificationItem } from '../../api/notificationApi';

interface NotificationBellProps {
  theme?: 'light' | 'dark';
}

export const NotificationBell = ({ theme = 'dark' }: NotificationBellProps) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const fetchNotifications = async () => {
    const auth = localStorage.getItem('isLoggedIn');
    if (auth !== 'true') return;
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications in bell component:', error);
    }
  };

  // Poll for notifications in the background
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 25000); // Poll every 25 seconds

    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setIsDropdownOpen(false);
    try {
      if (!notif.isRead) {
        await notificationApi.markAsRead(notif._id);
        await fetchNotifications();
      }
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.error('Failed to process notification click:', err);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notif: NotificationItem) => {
    e.stopPropagation();
    const { _id: id } = notif;

    if (deletingIds.has(id)) return;

    const wasUnread = !notif.isRead;
    const previous = notifications;

    setDeletingIds((prev) => new Set(prev).add(id));
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (wasUnread) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    try {
      await notificationApi.deleteNotification(id);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      // Already removed (double-click / race) — keep optimistic UI
      if (status !== 404) {
        setNotifications(previous);
        if (wasUnread) {
          setUnreadCount((c) => c + 1);
        }
        console.error('Failed to delete notification:', err);
      }
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Helper: return appropriate icon per notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'business_approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'business_rejected':
      case 'business_deleted':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'business_pending':
        return <Clock className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#097DDD] shrink-0" />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
          isDark 
            ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5' 
            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-100'
        }`}
      >
        <Bell size={20} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-[2rem] overflow-hidden shadow-2xl border z-[9999] ${
              isDark 
                ? 'bg-[#0D1F43]/95 backdrop-blur-2xl border-white/10 text-white' 
                : 'bg-white border-slate-200 text-slate-850'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${
              isDark ? 'border-white/5' : 'border-slate-100'
            }`}>
              <h3 className={`font-black text-sm uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-black text-[#097DDD] hover:text-[#0869bb] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Mark All Read
                </button>
              )}
            </div>

            {/* Notification List Scroll Zone */}
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-white/5 text-white/30' : 'bg-slate-50 text-slate-300'
                  }`}>
                    <Bell size={22} strokeWidth={1.5} />
                  </div>
                  <p className={`text-xs font-bold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    All caught up! No notifications.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-transparent">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`relative flex gap-4 p-5 transition-all cursor-pointer group ${
                        !notif.isRead 
                          ? isDark ? 'bg-white/[0.03]' : 'bg-blue-50/40' 
                          : 'hover:bg-transparent'
                      } ${
                        isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Left Side Status Icon */}
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content Area */}
                      <div className="flex-grow space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-xs font-black leading-tight tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {notif.title}
                          </h4>
                          {/* Close / Delete Icon - visible on hover */}
                          <button
                            type="button"
                            disabled={deletingIds.has(notif._id)}
                            onClick={(e) => handleDeleteNotification(e, notif)}
                            className={`p-1 rounded-lg shrink-0 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed ${
                              isDark 
                                ? 'hover:bg-white/10 text-white/30 hover:text-rose-400' 
                                : 'hover:bg-slate-100 text-slate-400 hover:text-rose-500'
                            }`}
                            title="Delete alert"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {notif.type === 'business_rejected' && notif.rejectionReason ? (
                          <div className="space-y-1.5">
                            <p className={`text-[10px] font-black uppercase tracking-wide leading-snug ${
                              isDark ? 'text-rose-300/90' : 'text-rose-600'
                            }`}>
                              This is the reason why your business got rejected.
                            </p>
                            <p className={`text-[11px] leading-relaxed font-semibold ${
                              isDark ? 'text-white/70' : 'text-slate-600'
                            }`}>
                              {notif.rejectionReason}
                            </p>
                          </div>
                        ) : (
                          <p className={`text-[11px] leading-relaxed font-semibold ${
                            isDark ? 'text-white/60' : 'text-slate-550'
                          }`}>
                            {notif.message}
                          </p>
                        )}
                        <p className={`text-[9px] font-black uppercase tracking-wider ${
                          isDark ? 'text-white/30' : 'text-slate-400'
                        }`}>
                          {new Date(notif.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                          })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Blue Glow Dot for Unread */}
                      {!notif.isRead && (
                        <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
