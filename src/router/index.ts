import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Gallery from "../views/gallery.vue";

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
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
