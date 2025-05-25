<template>
  <div
    class="card h-100 shadow-sm position-relative"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    :class="{ 'shadow-lg': isHovered }"
    style="cursor: pointer; transition: all 0.2s ease"
  >
    <div class="position-relative overflow-hidden">
      <img
        :src="url"
        :alt="author"
        class="card-img-top"
        style="height: 200px; object-fit: cover"
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
                class="btn btn-light btn-sm rounded-pill px-3"
                @click.stop="handleClick"
              >
                <i class="bi bi-zoom-in me-2"></i>
                Zobacz szczegóły
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

const isHovered = ref(false);

const props = defineProps({
  id: { type: String, required: true },
  author: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validator: (value: string) => {
      return !!value && (value.startsWith("http") || value.startsWith("/"));
    },
  },
});

const emit = defineEmits(["select"]);

const handleClick = () => {
  emit("select", props.id);
};

const isLoading = ref(true);
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
</style>
