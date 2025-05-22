import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Gallery from "../views/gallery.vue";
import Formularz from "../views/formularz.vue";
import Recenzje from "../components/listaRecenzji.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
  },
  {
    path: "/photo/:id",
    name: "PhotoDetails",
    component: () => import("../views/photoDetails.vue"),
    props: true,
  },
  {
    path: "/formularz",
    name: "Formularz",
    component: Formularz,
  },
  {
    path: "/recenzje",
    name: "Recenzje",
    component: Recenzje,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
