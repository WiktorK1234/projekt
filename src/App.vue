<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold">
          <i class="bi bi-controller me-2"></i>{{ $t("brand") }}
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarContent"
          ref="navbarCollapseRef"
        >
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link px-3"
                active-class="active"
                @click="closeNavbarOnMobile"
              >
                <i class="bi bi-house-door me-1"></i>{{ $t("navbar.home") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/gallery"
                class="nav-link px-3"
                active-class="active"
                @click="closeNavbarOnMobile"
              >
                <i class="bi bi-images me-1"></i>{{ $t("navbar.gallery") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/formularz"
                class="nav-link px-3"
                active-class="active"
                @click="closeNavbarOnMobile"
              >
                <i class="bi bi-archive-fill me-1"></i>{{ $t("navbar.form") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/recenzje"
                class="nav-link px-3"
                active-class="active"
                @click="closeNavbarOnMobile"
              >
                <i class="bi bi-list-ul me-1"></i>{{ $t("navbar.reviews") }}
              </router-link>
            </li>
            <li class="nav-item">
              <select
                v-model="$i18n.locale"
                class="form-select ms-2"
                style="width: auto"
              >
                <option value="pl">Polski</option>
                <option value="en">English</option>
              </select>
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
          <span class="visually-hidden">{{ $t("common.loading") }}</span>
        </div>
        <p class="mt-2 text-white">{{ $t("common.loadingMessage") }}</p>
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
                toast.title || $t(`toast.${toast.type}`)
              }}</strong>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="toast"
                :aria-label="$t('common.close')"
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
            <h5 class="fw-bold">{{ $t("footer.contactHeader") }}</h5>
            <p class="mb-0">{{ $t("footer.contactText") }}</p>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">{{ $t("footer.links") }}</h5>
            <ul class="list-unstyled">
              <li class="btn-group-vertical">
                <a
                  href="https://www.facebook.com/"
                  class="btn btn-outline-primary mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-facebook me-2"></i> Facebook
                </a>
                <a
                  href="https://www.instagram.com/"
                  class="btn btn-outline-warning mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-instagram me-2"></i> Instagram
                </a>
                <router-link
                  to="/polityka-prywatnosci"
                  class="btn btn-outline-danger"
                >
                  {{ $t("footer.privacyPolicy") }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">{{ $t("footer.contactInfo") }}</h5>
            <ul class="list-unstyled">
              <li><i class="bi bi-envelope me-2"></i> GameZone@gmail.com</li>
              <li><i class="bi bi-phone me-2"></i> +48 123 456 789</li>
            </ul>
          </div>
        </div>
        <hr class="my-4 bg-light" />
        <div class="text-center">
          <p class="mb-0">{{ $t("footer.copyright") }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import { Collapse, Toast } from "bootstrap";
import { useNotificationsStore } from "@/stores/notifications";
import type { ToastType } from "@/stores/notifications";
import { useLoadingStore } from "@/stores/loading";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notifications = useNotificationsStore();
const loading = useLoadingStore();
const toastElements = ref<HTMLElement[]>([]);
const navbarCollapseRef = ref<HTMLElement | null>(null);
let navbarCollapse: Collapse | null = null;

onMounted(() => {
  if (navbarCollapseRef.value) {
    navbarCollapse = new Collapse(navbarCollapseRef.value, {
      toggle: false,
    });
  }
});

const toggleNavbar = () => {
  if (!navbarCollapse) return;
  if (!navbarCollapseRef.value?.classList.contains("show")) {
    navbarCollapse.show();
  }
};

const closeNavbarOnMobile = () => {
  if (window.innerWidth < 992 && navbarCollapse) {
    navbarCollapse.hide();
  }
};

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
.navbar-collapse.collapsing {
  height: auto;
  transition: height 0.35s ease;
}

@media (max-width: 991px) {
  .navbar-collapse {
    background-color: var(--bs-primary);
    padding: 1rem;
    margin-top: 0.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }

  .nav-link {
    padding: 0.75rem 1rem !important;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.toast {
  min-width: 300px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.toast-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-transition-enter-active,
.toast-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-transition-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
