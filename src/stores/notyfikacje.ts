import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timeout?: number;
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    showToast(
      type: ToastType,
      message: string,
      config?: { title?: string; timeout?: number }
    ) {
      const toast: Toast = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        title: config?.title,
        timeout: config?.timeout || 3000,
      };

      this.toasts.push(toast);
    },

    removeToast(id: symbol) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },

  getters: {
    activeToasts: (state) => state.toasts,
  },
});
