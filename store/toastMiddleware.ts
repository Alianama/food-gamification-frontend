/**
 * Toast Middleware
 * Menampilkan toast notification berdasarkan action type.
 * Ini memisahkan side effect (UI notification) dari reducer logic.
 */

import { Middleware } from '@reduxjs/toolkit';
import { showError, showSuccess } from '@/utils/toast';

export const toastMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  // Success toasts
  if (action.type?.endsWith('/fulfilled')) {
    if (action.type?.startsWith('food/detect')) {
      showSuccess('Makanan berhasil terdeteksi!');
    } else if (action.type?.startsWith('food/confirm')) {
      showSuccess('Makanan berhasil dikonfirmasi!');
    }
  }

  // Error toasts
  if (action.type?.endsWith('/rejected')) {
    const message = action.payload || action.error?.message || 'Terjadi kesalahan';
    if (message && typeof message === 'string') {
      showError(message);
    }
  }

  return result;
};
