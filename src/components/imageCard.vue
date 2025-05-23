<template>
  <div
    class="card h-100 shadow-sm position-relative"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    :class="{ 'shadow-lg': isHovered }"
    style="cursor: pointer; transition: all 0.2s ease"
    @click="handleClick"
  >
    <div class="position-relative overflow-hidden">
      <img
        :src="download_url || url"
        :alt="author"
        class="card-img-top"
        style="height: 200px; object-fit: cover"
      />

      <transition name="fade">
        <div
          v-if="isHovered"
          class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end bg-dark bg-opacity-25"
        >
          <div class="w-100 text-center mb-3">
            <button class="btn btn-light btn-sm rounded-pill px-3">
              <i class="bi bi-zoom-in me-2"></i>
              Zobacz szczegóły
            </button>
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
  download_url: { type: String, required: true },
  url: { type: String, default: "" },
});

const emit = defineEmits(["select"]);

const handleClick = () => {
  emit("select", props.id);
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
</style>
