<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold">
          <i class="bi bi-controller me-2"></i>GameZone
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-3" active-class="active">
                <i class="bi bi-house-door me-1"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/gallery"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-images me-1"></i>Galeria
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/formularz"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-archive-fill me-1"></i>Formularz
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/recenzje"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-list-ul me-1"></i>Recenzje
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 py-4">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <div v-if="loading.isLoading" class="global-loader">
      <div class="loader-content">
        <div
          class="spinner-border text-primary"
          style="width: 3rem; height: 3rem"
        >
          <span class="visually-hidden">Ładowanie...</span>
        </div>
        <p class="mt-2 text-white">Trwa przetwarzanie...</p>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <transition-group name="toast-transition">
        <template
          v-for="(toast, index) in notifications.activeToasts"
          :key="toast.id"
        >
          <div
            ref="toastElements"
            class="toast"
            :class="`bg-${toast.type} text-white`"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            :data-bs-delay="toast.timeout"
          >
            <div class="toast-header">
              <i class="bi me-2" :class="getToastIcon(toast.type)"></i>
              <strong class="me-auto">{{
                toast.title || getDefaultTitle(toast.type)
              }}</strong>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="toast"
                aria-label="Zamknij"
              ></button>
            </div>
            <div class="toast-body">{{ toast.message }}</div>
          </div>
        </template>
      </transition-group>
    </div>

    <footer class="bg-dark text-white py-4 mt-auto">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="fw-bold">Chcesz wiedzieć więcej?</h5>
            <p class="mb-0">
              Napisz do nas, zadzwoń lub śledź nas w mediach społecznościowych,
              gdzie publikujemy najnowsze informacje związane z grami oraz ich
              przecenami.
            </p>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Linki</h5>
            <ul class="list-unstyled">
              <li class="btn-group-vertical">
                <button class="btn btn-outline-primary mb-2">
                  <i class="bi bi-facebook me-2"></i> Facebook
                </button>
                <button class="btn btn-outline-warning mb-2">
                  <i class="bi bi-instagram me-2"></i> Instagram
                </button>
                <router-link to="#" class="btn btn-outline-danger"
                  >Polityka prywatności</router-link
                >
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Kontakt</h5>
            <ul class="list-unstyled">
              <li><i class="bi bi-envelope me-2"></i> GameZone@gmail.com</li>
              <li><i class="bi bi-phone me-2"></i> +48 123 456 789</li>
            </ul>
          </div>
        </div>
        <hr class="my-4 bg-light" />
        <div class="text-center">
          <p class="mb-0">&copy; 2023 GameZone. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Toast } from "bootstrap";
import { useNotificationsStore } from "@/stores/notyfikacje";
import type { ToastType } from "@/stores/notyfikacje";
import { useLoadingStore } from "@/stores/loading";

const notifications = useNotificationsStore();
const toastElements = ref<HTMLElement[]>([]);
const loading = useLoadingStore();

const getDefaultTitle = (type: ToastType) => {
  return {
    success: "Sukces!",
    error: "Błąd!",
    warning: "Ostrzeżenie",
    info: "Informacja",
  }[type];
};

const getToastIcon = (type: ToastType) => {
  return {
    success: "bi-check-circle-fill text-success",
    error: "bi-x-circle-fill text-danger",
    warning: "bi-exclamation-triangle-fill text-warning",
    info: "bi-info-circle-fill text-info",
  }[type];
};

watch(
  () => notifications.activeToasts,
  async (newToasts) => {
    await nextTick();

    newToasts.forEach((toast, index) => {
      const element = toastElements.value[index];
      if (element && !(element as any)._toast) {
        const bsToast = new Toast(element, {
          autohide: true,
          delay: toast.timeout,
        });

        (element as any)._toast = bsToast;

        element.addEventListener("hidden.bs.toast", () => {
          notifications.removeToast(toast.id);
        });

        bsToast.show();
      }
    });
  },
  { deep: true }
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast {
  min-width: 300px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.toast-header {
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.toast-body {
  padding: 1rem;
}

.toast-success .toast-header {
  color: #0f5132;
  background-color: #d1e7dd;
}

.toast-error .toast-header {
  color: #842029;
  background-color: #f8d7da;
}

.toast-warning .toast-header {
  color: #664d03;
  background-color: #fff3cd;
}

.toast-info .toast-header {
  color: #084298;
  background-color: #cfe2ff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.loader-content {
  text-align: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
