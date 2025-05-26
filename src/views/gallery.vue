<template>
  <div class="container my-5">
    <div v-if="photoStore.loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t("common.loading") }}</span>
      </div>
      <p class="mt-2">{{ $t("common.loading") }}</p>
    </div>

    <div v-if="photoStore.error" class="alert alert-danger mt-4">
      {{ photoStore.error }}
    </div>

    <div v-else>
      <div
        v-if="
          photoStore.gamesPhotos.length === 0 &&
          photoStore.charactersPhotos.length === 0
        "
        class="alert alert-warning mt-4"
      >
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ $t("gallery.noPhotos") }}
      </div>

      <div class="text-center mb-5">
        <h1 class="display-4 text-primary">
          {{ $t("gallery.title") }}
          <i class="bi bi-heart-fill text-success me-2"></i>
        </h1>
        <p class="lead">{{ $t("gallery.subtitle") }}</p>
      </div>

      <div class="mb-5">
        <h2 class="text-primary mb-4">{{ $t("gallery.gamesSection") }}</h2>
        <div class="row g-4" data-testid="games-section">
          <div
            v-for="photo in photoStore.gamesPhotos"
            :key="photo.id"
            class="col-6 col-sm-6 col-md-4 col-lg-3"
          >
            <ImageCard
              v-if="photo.url && photo.url.trim() !== ''"
              :id="photo.id.toString()"
              :url="photo.url"
              :author="photo.user"
              @select="onSelect"
            />
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h2 class="text-primary mb-4">{{ $t("gallery.charactersSection") }}</h2>
        <div class="row g-4" data-testid="characters-section">
          <div
            v-for="photo in photoStore.charactersPhotos"
            :key="photo.id"
            class="col-6 col-sm-6 col-md-4 col-lg-3"
          >
            <ImageCard
              v-if="photo.url && photo.url.trim() !== ''"
              :id="photo.id.toString()"
              :url="photo.url"
              :author="photo.user"
              @select="onSelect"
            />
          </div>
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

const onSelect = async (id: string) => {
  try {
    await router.push(`/photo/${id}`);
  } catch (error) {
    console.error("Błąd nawigacji:", error);
  }
};

onMounted(async () => {
  try {
    photoStore.loadFromLocalStorage();
    if (photoStore.allPhotos.length === 0) {
      await photoStore.fetchPhotos();
    }
  } catch (error) {
    console.error("Błąd inicjalizacji galerii:", error);
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert-warning {
  border: 1px solid #ffecb5;
  background-color: #fff4d6;
}

@media (max-width: 400px) {
  .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .card-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .lead {
    font-size: 1rem;
  }
}
</style>
