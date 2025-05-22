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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IPhoto } from "../models/IPhoto";

const route = useRoute();
const router = useRouter();
const photo = ref<IPhoto | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const aspectRatio = computed(() => {
  if (!photo.value) return "";
  const ratio = photo.value.imageWidth / photo.value.imageHeight;
  return ratio.toFixed(2) + ":1";
});

const loadCachedPhotos = (): IPhoto[] => {
  try {
    const cached = localStorage.getItem("galleryPhotos");
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    console.error("Błąd odczytu cache:", e);
    return [];
  }
};

const goBack = () => {
  router.push("/gallery");
};

onMounted(() => {
  try {
    const id = Number(route.params.id);
    if (isNaN(id)) throw new Error("Nieprawidłowe ID zdjęcia");

    const allPhotos = loadCachedPhotos();
    photo.value = allPhotos.find((p) => p.id === id) || null;

    if (!photo.value) {
      error.value = "Zdjęcie nie zostało znalezione w pamięci podręcznej";
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
