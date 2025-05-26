<template>
  <div
    class="card h-100 shadow-sm position-relative"
    data-testid="image-card"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="ratio ratio-1x1">
      <img
        :src="url"
        :alt="author"
        class="card-img-top"
        style="object-fit: cover"
        loading="lazy"
      />

      <transition name="fade">
        <div
          v-if="isHovered"
          class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end bg-dark bg-opacity-25"
        >
          <div class="w-100 text-center mb-3">
            <slot name="actions">
              <button
                data-testid="details-button"
                class="btn btn-light btn-sm rounded-pill px-3"
                @click.stop="handleClick"
              >
                <template v-if="!localLoading">
                  <i class="bi bi-zoom-in me-2"></i>
                  {{ $t("gallery.viewDetails") }}
                </template>
                <template v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ $t("common.loading") }}
                </template>
              </button>
            </slot>
          </div>
        </div>
      </transition>
    </div>

    <div class="card-footer bg-info bg-gradient text-white text-center py-2">
      <h5 class="card-title mb-0 small">{{ author }}</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type IPhoto from "@/models/IPhoto";

const isHovered = ref(false);
const localLoading = ref(false);

const props = defineProps<{
  id: string;
  author: string;
  url: IPhoto["url"];
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const handleClick = async () => {
  localLoading.value = true;
  try {
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 300)),
      new Promise((resolve) => {
        emit("select", props.id);
        resolve(true);
      }),
    ]);
  } finally {
    localLoading.value = false;
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
  backdrop-filter: blur(4px);
}

.image-loader {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.local-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
</style>
