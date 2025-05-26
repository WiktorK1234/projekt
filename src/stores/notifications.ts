import { defineStore } from "pinia";
import { Toast } from "bootstrap";
import { nextTick } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface IToast {
  id: symbol;
  type: ToastType;
  message: string;
  title?: string;
  timeout?: number;
  element?: HTMLElement;
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    toasts: [] as IToast[],
  }),

  actions: {
    showToast(
      type: ToastType,
      message: string,
      config?: { title?: string; timeout?: number }
    ) {
      const toast: IToast = {
        id: Symbol(`toast_${Date.now()}`),
        type,
        message,
        title: config?.title,
        timeout: config?.timeout || 3000,
      };

      this.toasts.push(toast);

      nextTick(() => {
        const toastElement = document.querySelector(
          `[data-toast-id="${toast.id.description}"]`
        );
        if (toastElement) {
          const bsToast = new Toast(toastElement, {
            autohide: config?.timeout !== 0,
            delay: toast.timeout,
          });
          bsToast.show();

          toastElement.addEventListener("hidden.bs.toast", () => {
            this.removeToast(toast.id);
          });
        }
      });
    },

    removeToast(id: symbol) {
      const index = this.toasts.findIndex((t) => t.id === id);
      if (index > -1) {
        const toast = this.toasts[index];
        if (toast.element) {
          const bsToast = Toast.getInstance(toast.element);
          bsToast?.dispose();
        }
        this.toasts.splice(index, 1);
      }
    },
  },

  getters: {
    activeToasts: (state) => state.toasts,
  },
});
