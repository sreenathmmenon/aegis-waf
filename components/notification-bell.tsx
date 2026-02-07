"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, AlertTriangle, Flag } from 'lucide-react';
import { useEventStream } from '@/hooks/use-event-stream';
import { ThreatEvent } from '@/lib/event-bus';

/**
 * Notification bell icon with badge and dropdown
 */
export function NotificationBell() {
  const { events } = useEventStream();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeenId, setLastSeenId] = useState<string>('');

  // Calculate unread count
  useEffect(() => {
    if (events.length === 0) return;

    const latestId = events[0].id;
    if (lastSeenId === '') {
      setLastSeenId(latestId);
      return;
    }

    // Count new events since last seen
    const newEvents = events.filter(e => {
      const eventTime = new Date(e.timestamp).getTime();
      const lastSeenTime = new Date(events.find(ev => ev.id === lastSeenId)?.timestamp || 0).getTime();
      return eventTime > lastSeenTime && e.action !== 'ALLOW';
    });

    setUnreadCount(newEvents.length);
  }, [events, lastSeenId]);

  // Mark as read when opening dropdown
  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && events.length > 0) {
      setLastSeenId(events[0].id);
      setUnreadCount(0);
    }
  };

  // Get last 10 non-ALLOW events
  const recentThreats = events
    .filter(e => e.action !== 'ALLOW')
    .slice(0, 10);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-[#1e1e2e] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-400" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}

        {/* Pulse animation on new notification */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 animate-ping bg-red-500 rounded-full opacity-75" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-96 bg-[#12121a] border border-[#1e1e2e] rounded-xl shadow-2xl z-50 max-h-[32rem] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#1e1e2e]">
                <h3 className="font-semibold text-white">Recent Threats</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Last 10 security events
                </p>
              </div>

              {/* Event List */}
              <div className="overflow-y-auto flex-1">
                {recentThreats.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent threats</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1e1e2e]">
                    {recentThreats.map((event) => (
                      <NotificationItem key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NotificationItemProps {
  event: ThreatEvent;
}

function NotificationItem({ event }: NotificationItemProps) {
  const { action, input_preview, timestamp, severity, category } = event;

  const config = {
    BLOCK: {
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    FLAG: {
      icon: Flag,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    ALLOW: {
      icon: Shield,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    }
  };

  const style = config[action];
  const Icon = style.icon;

  // Format timestamp
  const timeAgo = getTimeAgo(new Date(timestamp));

  return (
    <div className="p-3 hover:bg-[#1e1e2e]/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${style.bg} rounded-lg p-2 mt-0.5`}>
          <Icon className={`h-4 w-4 ${style.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`font-medium text-xs ${style.color}`}>
              {action === 'BLOCK' ? 'Blocked' : 'Flagged'}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>

          <p className="text-xs text-gray-300 line-clamp-2 mb-1.5 leading-relaxed">
            {input_preview}
          </p>

          {category && (
            <span className="text-xs text-gray-500">
              {category.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
