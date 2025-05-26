import { defineStore } from "pinia";
import { searchImages } from "@/api/pixabayAPI";
import type { IPhoto } from "@/models/IPhoto";
import { useLoadingStore } from "./loading";

interface PhotoState {
  allPhotos: IPhoto[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export const usePhotoStore = defineStore("photos", {
  state: (): PhotoState => ({
    allPhotos: [],
    loading: false,
    error: null,
    lastFetch: null,
  }),

  actions: {
    async fetchPhotos() {
      const loadingStore = useLoadingStore();
      try {
        this.loading = true;
        loadingStore.start();

        if (!this.lastFetch || Date.now() - this.lastFetch > 3600000) {
          const [games, characters] = await Promise.all([
            this.fetchCategory("video games", "games", 20),
            this.fetchCategory("game character", "characters", 20),
          ]);

          this.allPhotos = [...games, ...characters];
          this.lastFetch = Date.now();
          this.saveToLocalStorage();
        }
      } catch (error) {
        this.error = "Błąd pobierania zdjęć. Spróbuj ponownie później.";
        console.error("Store error:", error);
      } finally {
        this.loading = false;
        loadingStore.stop();
      }
    },

    async fetchCategory(
      query: string,
      category: IPhoto["category"],
      count: number
    ): Promise<IPhoto[]> {
      try {
        const photos = await searchImages(query, category, count);
        return photos.map((photo) => ({
          ...photo,
          category: photo.category || category,
        }));
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return [];
      }
    },

    saveToLocalStorage() {
      localStorage.setItem("galleryPhotos", JSON.stringify(this.allPhotos));
    },

    loadFromLocalStorage() {
      const cached = localStorage.getItem("galleryPhotos");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.allPhotos = parsed.filter((photo: IPhoto) =>
            photo?.url?.startsWith("https://")
          );
        } catch (error) {
          console.error("Error parsing cache:", error);
        }
      }
    },

    getPhotoById(id: number): IPhoto | undefined {
      return this.allPhotos.find((photo) => photo.id === id);
    },
  },

  getters: {
    gamesPhotos: (state) =>
      state.allPhotos.filter((p) => p.category === "games").slice(0, 10),

    charactersPhotos: (state) =>
      state.allPhotos
        .filter((p) => p.category === "characters")
        .slice(0, 10)
        .sort((a, b) => b.id - a.id),
  },
});
