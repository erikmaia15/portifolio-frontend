import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ToastMessage } from '@/types/project';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([]);

  function add(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    duration = 4000
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, message, type, title, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  }

  function success(message: string, title = 'Sucesso!') {
    add(message, 'success', title);
  }

  function error(message: string, title = 'Ops, ocorreu um erro') {
    add(message, 'error', title, 5000);
  }

  function info(message: string, title = 'Informação') {
    add(message, 'info', title);
  }

  function warning(message: string, title = 'Atenção') {
    add(message, 'warning', title);
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    add,
    success,
    error,
    info,
    warning,
    remove,
  };
});
