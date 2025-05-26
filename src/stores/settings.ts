import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    darkMode: localStorage.getItem("darkMode") === "true" || false,
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode.toString());
      this.applyDarkMode();
    },
    applyDarkMode() {
      if (this.darkMode) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
    },
  },
});
