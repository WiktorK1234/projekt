import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { useSettingsStore } from "@/stores/settings";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import pl from "@/locales/pl.json";
import en from "@/locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: "pl",
  fallbackLocale: "en",
  messages: { pl, en },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(router);
app.use(i18n);

const settingsStore = useSettingsStore();
settingsStore.applyDarkMode();

app.mount("#app");
