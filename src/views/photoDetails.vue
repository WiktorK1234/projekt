<template>
  <div class="container my-5">
    <div v-if="loading.isLoading" class="text-center py-5">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="visually-hidden">Ładowanie...</span>
      </div>
      <div class="mt-3">
        <h3 class="text-primary">Trwa wczytywanie zdjęcia...</h3>
        <div
          class="progress mt-3 mx-auto"
          style="max-width: 300px; height: 8px"
        >
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style="width: 45%"
          ></div>
        </div>
        <p class="text-muted small mt-2">ID: {{ $route.params.id }}</p>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      <i class="bi bi-exclamation-octagon me-2"></i>
      {{ error }}
      <div class="mt-3">
        <button @click="goBack" class="btn btn-outline-danger">
          <i class="bi bi-arrow-left me-2"></i>
          Powrót do galerii
        </button>
      </div>
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
                :src="photo.url"
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

            <div class="mt-4">
              <button @click="goBack" class="btn btn-outline-primary">
                <i class="bi bi-arrow-left me-2"></i>
                Powrót do galerii
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePhotoStore } from "../stores/photos";
import { useLoadingStore } from "@/stores/loading";
import { useNotificationsStore } from "@/stores/notyfikacje";

const route = useRoute();
const router = useRouter();
const photoStore = usePhotoStore();
const error = ref<string | null>(null);
const loading = useLoadingStore();
const notifications = useNotificationsStore();

const photo = computed(() => {
  const id = Number(route.params.id);

  if (isNaN(id)) {
    console.error("[PhotoDetails] Nieprawidłowe ID z URL:", route.params.id);
    error.value = "Nieprawidłowy identyfikator zdjęcia";
    return null;
  }

  const foundPhoto = photoStore.getPhotoById(id);

  if (!foundPhoto) {
    console.warn("[PhotoDetails] Zdjęcie nieznalezione w store dla ID:", id);
    error.value = "Zdjęcie nie zostało znalezione";
  }

  return foundPhoto;
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
  console.debug("[PhotoDetails] Komponent zamontowany, ID:", route.params.id);

  try {
    console.info("[PhotoDetails] Rozpoczęcie ładowania szczegółów");

    if (!photo.value) {
      console.debug("[PhotoDetails] Brak zdjęcia w store - pobieranie danych");
      await loading.wrapAsync(photoStore.fetchPhotos());
    }

    if (!photo.value) {
      console.error("[PhotoDetails] Zdjęcie nieznalezione po pobraniu danych");
      throw new Error("Zdjęcie nie istnieje w bazie");
    }

    console.log(
      "[PhotoDetails] Pomyślnie załadowano dane dla ID:",
      route.params.id
    );
  } catch (err) {
    console.error("[PhotoDetails] Krytyczny błąd:", err);
    notifications.showToast("error", "Nie udało się załadować zdjęcia");
    await router.push("/gallery");
  } finally {
    console.info("[PhotoDetails] Zakończono proces inicjalizacji");
  }
});

watch(
  () => route.params.id,
  async (newId) => {
    console.debug("[PhotoDetails] Zmiana ID zdjęcia:", newId);

    try {
      const photoId = Number(newId);
      if (isNaN(photoId)) {
        throw new Error("Nieprawidłowy format ID");
      }

      if (!photoStore.getPhotoById(photoId)) {
        console.warn("[PhotoDetails] Zdjęcie nie istnieje dla nowego ID");
        throw new Error("Zdjęcie nieznalezione");
      }
    } catch (err) {
      console.error("[PhotoDetails] Błąd zmiany ID:", err);
      notifications.showToast("error", "Nieprawidłowe zdjęcie");
      await router.replace("/gallery");
    }
  }
);
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

.progress-bar {
  transition: width 0.9s ease;
}

.spinner-border {
  border-width: 0.2em;
}
</style>
