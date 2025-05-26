import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

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

console.log("Environment variables:", import.meta.env);
console.log("Pixabay API Key:", import.meta.env.VITE_kluczAPI);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
