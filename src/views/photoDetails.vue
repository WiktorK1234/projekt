<template>
  <div class="container my-5">
    <div class="mb-4">
      <button @click="goBack" class="btn btn-outline-primary">
        <i class="bi bi-arrow-left me-2"></i>
        Powrót do galerii
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Ładowanie zdjęcia...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else-if="!photo" class="alert alert-warning text-center">
      Zdjęcie nie zostało znalezione
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-body text-center">
            <h2 class="card-title mb-4">Szczegóły zdjęcia</h2>

            <div class="ratio ratio-16x9 mb-4">
              <img
                :src="photo.largeImageURL"
                :alt="photo.user"
                class="img-fluid object-fit-cover"
              />
            </div>

            <div class="text-start">
              <h5 class="mb-3">Autor: {{ photo.user }}</h5>
              <p><strong>Wysokość:</strong> {{ photo.imageHeight }} px</p>
              <p><strong>Szerokość:</strong> {{ photo.imageWidth }} px</p>
              <p><strong>Proporcje:</strong> {{ aspectRatio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePhotoStore } from "../stores/photos";

const route = useRoute();
const router = useRouter();
const photoStore = usePhotoStore();

const loading = ref(true);
const error = ref<string | null>(null);

const photo = computed(() => {
  const id = Number(route.params.id);
  if (isNaN(id)) {
    error.value = "Nieprawidłowe ID zdjęcia";
    return null;
  }
  return photoStore.getPhotoById(id);
});

const aspectRatio = computed(() => {
  if (!photo.value) return "";
  const ratio = photo.value.imageWidth / photo.value.imageHeight;
  return ratio.toFixed(2) + ":1";
});

const goBack = () => {
  router.push("/gallery");
};

onMounted(async () => {
  try {
    loading.value = true;

    if (photoStore.allPhotos.length === 0) {
      await photoStore.fetchPhotos();
    }

    if (!photo.value) {
      error.value = "Zdjęcie nie zostało znalezione";
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Nieznany błąd";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

.ratio {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card {
  border: none;
  border-radius: 0.75rem;
}
</style>
