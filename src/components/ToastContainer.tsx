import React from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useRealEstate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
