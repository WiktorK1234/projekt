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
      <div
        v-if="
          photoStore.gamesPhotos.length === 0 &&
          photoStore.charactersPhotos.length === 0
        "
        class="alert alert-warning mt-4"
      >
        <i class="bi bi-exclamation-triangle me-2"></i>
        Brak zdjęć do wyświetlenia. Spróbuj odświeżyć stronę.
      </div>

      <div class="text-center mb-5">
        <h1 class="display-4 text-primary">
          Galeria zdjęć od naszych fanów!
          <i class="bi bi-heart-fill text-success me-2"></i>
        </h1>
        <p class="lead">Zobacz zdjęcia wysłane do nas od naszej społeczności</p>
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
              v-if="photo.url && photo.url.trim() !== ''"
              :id="photo.id.toString()"
              :url="photo.url"
              :author="photo.user"
              @select="onSelect"
            />
          </div>
        </div>
        <div v-if="photoStore.gamesPhotos.length < 10" class="text-muted mt-3">
          (Wyświetlamy wszystkie dostępne zdjęcia w tej kategorii)
        </div>
      </div>

      <div class="mb-5">
        <h2 class="text-primary mb-4">👾 Postacie z gier</h2>
        <div class="row g-4">
          <div
            v-for="photo in photoStore.charactersPhotos"
            :key="photo.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
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
        <div
          v-if="photoStore.charactersPhotos.length < 10"
          class="text-muted mt-3"
        >
          (Wyświetlamy wszystkie dostępne zdjęcia w tej kategorii)
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
import { useLoadingStore } from "@/stores/loading";
import { useNotificationsStore } from "@/stores/notyfikacje";

const router = useRouter();
const photoStore = usePhotoStore();
const loading = useLoadingStore();
const notifications = useNotificationsStore();

onMounted(async () => {
  console.debug("[Gallery] Rozpoczęcie inicjalizacji galerii");

  try {
    photoStore.loadFromLocalStorage();
    console.debug("[Gallery] Zdjęć w cache:", photoStore.allPhotos.length);

    if (photoStore.allPhotos.length === 0) {
      console.info("[Gallery] Brak danych w cache - pobieranie z API");
      await photoStore.fetchPhotos();
      console.debug("[Gallery] Pobrano zdjęć:", photoStore.allPhotos.length);
    } else {
      console.info("[Gallery] Używam zdjęć z cache");
    }
  } catch (error) {
    console.error("[Gallery] Błąd inicjalizacji:", error);
    notifications.showToast("error", "Błąd ładowania galerii");
  } finally {
    console.info("[Gallery] Zakończono inicjalizację");
  }
});

const onSelect = async (id: string) => {
  try {
    console.debug("[Gallery] Próba nawigacji do zdjęcia:", id);

    const photoExists = photoStore.getPhotoById(Number(id));
    if (!photoExists) {
      throw new Error("Zdjęcie nie istnieje");
    }

    await loading.wrapAsync(router.push(`/photo/${id}`));
  } catch (error) {
    console.error("[Gallery] Błąd nawigacji:", error);
    notifications.showToast("error", "Błąd otwierania szczegółów");

    router.push("/gallery");
  }
};
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
</style>
