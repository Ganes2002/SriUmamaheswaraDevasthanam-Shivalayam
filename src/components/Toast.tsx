import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let _addToast: ((item: ToastItem) => void) | null = null;

export function showToast(message: string, type: ToastType = 'success') {
  _addToast?.({ id: Date.now() + Math.random(), message, type });
}

const DURATION = 5000;

const CONFIG: Record<ToastType, {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  headerGradient: string;
  barColor: string;
  ringColor: string;
  label: string;
}> = {
  success: {
    Icon: CheckCircle2,
    headerGradient: 'from-emerald-600 to-emerald-500',
    barColor: 'bg-emerald-400',
    ringColor: 'ring-emerald-100',
    label: 'Success',
  },
  error: {
    Icon: XCircle,
    headerGradient: 'from-[#7A1E1E] to-[#A02828]',
    barColor: 'bg-[#7A1E1E]',
    ringColor: 'ring-red-100',
    label: 'Error',
  },
  warning: {
    Icon: AlertTriangle,
    headerGradient: 'from-amber-600 to-[#E29524]',
    barColor: 'bg-amber-500',
    ringColor: 'ring-amber-100',
    label: 'Warning',
  },
  info: {
    Icon: Info,
    headerGradient: 'from-blue-700 to-blue-500',
    barColor: 'bg-blue-500',
    ringColor: 'ring-blue-100',
    label: 'Info',
  },
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { Icon, headerGradient, barColor, ringColor, label } = CONFIG[item.type];
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timer.current = setTimeout(() => onDismiss(item.id), DURATION);
    return () => clearTimeout(timer.current);
  }, [item.id, onDismiss]);

  const dismiss = () => {
    clearTimeout(timer.current);
    onDismiss(item.id);
  };

  return (
    <div
      className={`w-80 rounded-2xl overflow-hidden shadow-2xl ring-1 ${ringColor} bg-white`}
      style={{ animation: 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      {/* Gradient header strip */}
      <div className={`bg-gradient-to-r ${headerGradient} px-4 py-2.5 flex items-center gap-2.5`}>
        <Icon size={15} className="text-white shrink-0" />
        <span className="text-white text-[11px] font-black uppercase tracking-[0.12em] flex-1">
          {label}
        </span>
        <button
          onClick={dismiss}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      </div>

      {/* Message body */}
      <div className="px-4 py-3.5 bg-white">
        <p className="text-[13px] font-medium text-stone-700 leading-relaxed">{item.message}</p>
      </div>

      {/* Animated progress bar */}
      <div
        className={`h-[3px] ${barColor}`}
        style={{ animation: `toastProgress ${DURATION}ms linear forwards` }}
      />
    </div>
  );
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Prepend so newest toast appears at top
    _addToast = (item) => setToasts(prev => [item, ...prev]);
    return () => { _addToast = null; };
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastCard item={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
