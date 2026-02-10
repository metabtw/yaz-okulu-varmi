/**
 * Modal - Onay, hata ve bilgi mesajları için yeniden kullanılabilir modal bileşeni.
 */
'use client';

import { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type ModalType = 'confirm' | 'error' | 'success' | 'info';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function Modal({
  open,
  onClose,
  title,
  message,
  type = 'info',
  confirmLabel = 'Tamam',
  cancelLabel = 'İptal',
  onConfirm,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const iconMap = {
    confirm: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    error: <AlertTriangle className="w-6 h-6 text-red-500" />,
    success: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const bgMap = {
    confirm: 'bg-amber-50',
    error: 'bg-red-50',
    success: 'bg-emerald-50',
    info: 'bg-blue-50',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className={`w-12 h-12 rounded-xl ${bgMap[type]} flex items-center justify-center shrink-0`}>
            {iconMap[type]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`h-10 px-5 rounded-xl text-sm font-medium text-white transition-all shadow-sm ${
              type === 'error' ? 'bg-red-500 hover:bg-red-400' :
              type === 'confirm' ? 'bg-red-500 hover:bg-red-400' :
              type === 'success' ? 'bg-emerald-500 hover:bg-emerald-400' :
              'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
