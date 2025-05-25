import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    counter: 0,
    minDelay: 500,
  }),
  getters: {
    isLoading: (state) => state.counter > 0,
  },
  actions: {
    start() {
      this.counter++;
    },
    stop() {
      setTimeout(() => {
        this.counter = Math.max(0, this.counter - 1);
      }, this.minDelay);
    },
    async wrapAsync<T>(promise: Promise<T>): Promise<T> {
      try {
        this.start();
        return await promise;
      } finally {
        this.stop();
      }
    },
  },
});
