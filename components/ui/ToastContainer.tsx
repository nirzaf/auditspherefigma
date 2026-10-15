'use client';

import React from 'react';
import { useAuditStore } from '@/lib/store';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function ToastContainer() {
  const { toasts, removeToast } = useAuditStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-colors ${
                isSuccess
                  ? 'bg-slate-900/95 text-white border-slate-700/80 shadow-slate-950/20'
                  : isWarning
                  ? 'bg-amber-950/95 text-amber-50 border-amber-800 shadow-amber-950/20'
                  : isError
                  ? 'bg-red-950/95 text-red-50 border-red-800 shadow-red-950/20'
                  : 'bg-slate-900/95 text-white border-slate-700/80 shadow-slate-950/20'
              }`}
            >
              {/* Type Icon */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
                {!isSuccess && !isWarning && !isError && (
                  <Info className="w-4 h-4 text-blue-400" />
                )}
              </div>

              {/* Text Message */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="font-semibold text-xs leading-snug tracking-tight text-slate-100 font-sans">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-[11px] text-slate-300 mt-1 leading-normal font-sans opacity-90">
                    {toast.description}
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-100 p-0.5 rounded transition-colors"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
