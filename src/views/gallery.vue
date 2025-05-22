<template>
  <div class="container my-5">
    <div v-if="photoStore.loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Ładowanie galerii...</p>
    </div>

    <div v-if="photoStore.error" class="alert alert-danger mt-4">
      {{ photoStore.error }}
    </div>

    <div v-else>
      <div class="text-center mb-5">
        <h1 class="display-4 text-primary">
          Galeria zdjęć od naszych fanów!
          <i class="bi bi-heart-fill text-success me-2"></i>
        </h1>
        <p class="lead">Zobacz zdjęcia wysłane do nas od naszych fanów</p>
      </div>

      <div class="mb-5">
        <h2 class="text-primary mb-4">🎮 Gry wideo/konsole</h2>
        <div class="row g-4">
          <div
            v-for="photo in photoStore.gamesPhotos"
            :key="photo.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <ImageCard
              :id="photo.id.toString()"
              :download_url="photo.webformatURL"
              :author="photo.user"
              @select="onSelect"
            />
          </div>
        </div>
        <div v-if="photoStore.gamesPhotos.length < 10" class="text-muted mt-3">
          (Wyświetlamy wszystkie dostępne zdjęcia w tej kategorii)
        </div>
        <div v-else class="text-muted mt-3">
          (Wyświetlamy najnowsze 10 zdjęć)
        </div>
      </div>

      <div class="mb-5">
        <h2 class="text-primary mb-4">👾 Postacie z gier wideo</h2>
        <div class="row g-4">
          <div
            v-for="photo in photoStore.charactersPhotos"
            :key="photo.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <ImageCard
              :id="photo.id.toString()"
              :url="photo.webformatURL"
              :author="photo.user"
              @select="onSelect"
            />
          </div>
        </div>
        <div
          v-if="photoStore.charactersPhotos.length < 10"
          class="text-muted mt-3"
        >
          (Wyświetlamy wszystkie dostępne zdjęcia w tej kategorii)
        </div>
        <div v-else class="text-muted mt-3">
          (Wyświetlamy najnowsze 10 zdjęć)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ImageCard from "../components/imageCard.vue";
import { usePhotoStore } from "@/stores/photos";

const router = useRouter();
const photoStore = usePhotoStore();

const onSelect = (id: string) => {
  router.push(`/photo/${id}`);
};

onMounted(async () => {
  photoStore.loadFromLocalStorage();
  if (photoStore.allPhotos.length === 0) {
    await photoStore.fetchPhotos();
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
