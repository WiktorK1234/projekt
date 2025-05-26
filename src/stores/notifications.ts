import { defineStore } from "pinia";
import type IToast from "@/models/IToast";

export type ToastType = "success" | "error" | "warning" | "info";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    toasts: [] as IToast[],
  }),

  actions: {
    showToast(
      type: IToast["type"],
      message: string,
      config?: { title?: string; timeout?: number }
    ) {
      const toast: IToast = {
        id: Symbol(),
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
