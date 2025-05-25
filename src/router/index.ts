import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Gallery from "../views/gallery.vue";
import Formularz from "../views/formularz.vue";
import Recenzje from "../views/listaRecenzji.vue";
import PolitykaPrywatnosci from "../views/politykaPrywatnosci.vue";

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
    path: "/polityka-prywatnosci",
    name: "politykaPrywatnosci",
    component: PolitykaPrywatnosci,
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

router.afterEach((to) => {
  if (__LOG_ENABLED__) {
    console.info(`[Router] Przejście do: ${to.path}`);
  }
});

export default router;
