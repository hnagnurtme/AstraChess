import React from 'react';

export interface ToastItem {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface ToastContainerProps {
  toasts: ToastItem[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
