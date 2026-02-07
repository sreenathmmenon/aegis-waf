"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { useEventStream } from '@/hooks/use-event-stream';
import { ThreatEvent } from '@/lib/event-bus';

interface ToastNotification extends ThreatEvent {
  toastId: string;
  expiresAt: number;
}

const MAX_VISIBLE_TOASTS = 4;

/**
 * Global threat notification toasts
 * Shows real-time security events in bottom-right corner
 */
export function ThreatNotifications() {
  const { events } = useEventStream();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Add new events as toasts
  useEffect(() => {
    if (events.length === 0) return;

    const latestEvent = events[0]; // Most recent event

    // Don't show toast for ALLOW events (too noisy)
    if (latestEvent.action === 'ALLOW') return;

    // Create toast with expiry
    const duration = latestEvent.action === 'BLOCK' ? 5000 : 4000;
    const newToast: ToastNotification = {
      ...latestEvent,
      toastId: `toast_${latestEvent.id}`,
      expiresAt: Date.now() + duration
    };

    setToasts(prev => {
      // Check if toast already exists
      if (prev.some(t => t.id === latestEvent.id)) {
        return prev;
      }

      // Add new toast at the beginning
      const updated = [newToast, ...prev];

      // Keep only MAX_VISIBLE_TOASTS
      return updated.slice(0, MAX_VISIBLE_TOASTS);
    });

    // Auto-remove after duration
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== newToast.toastId));
    }, duration);

    return () => clearTimeout(timer);
  }, [events]);

  // Manual dismiss
  const dismissToast = (toastId: string) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.toastId}
            toast={toast}
            onDismiss={() => dismissToast(toast.toastId)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { action, severity, input_preview, category, confidence } = toast;

  // Determine colors and icons based on action
  const config = {
    BLOCK: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-500',
      icon: Shield,
      title: 'Threat Blocked'
    },
    FLAG: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50',
      text: 'text-amber-500',
      icon: Flag,
      title: 'Suspicious Activity'
    },
    ALLOW: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-500',
      icon: CheckCircle,
      title: 'Request Allowed'
    }
  };

  const style = config[action];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto"
    >
      <div
        className={`
          ${style.bg} ${style.border}
          border-2 rounded-xl p-4 w-96 shadow-2xl
          backdrop-blur-sm
          ${action === 'BLOCK' ? 'animate-pulse-slow' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`${style.text} mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`font-semibold text-sm ${style.text}`}>
                {style.title}
              </span>
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Input preview */}
            <p className="text-xs text-gray-300 mb-2 line-clamp-2 leading-relaxed">
              {input_preview}
            </p>

            {/* Details */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {category && (
                <span className="truncate">
                  {category.replace(/_/g, ' ')}
                </span>
              )}
              <span className="text-gray-500">•</span>
              <span>
                {severity} ({(confidence * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Add pulse animation to globals.css
export const toastStyles = `
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
