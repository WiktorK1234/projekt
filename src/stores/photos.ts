import { defineStore } from "pinia";
import { searchImages } from "@/api/pixabayAPI";
import { IPhoto } from "@/models/IPhoto";

export const usePhotoStore = defineStore("photos", {
  state: () => ({
    allPhotos: [] as IPhoto[],
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null,
  }),
  actions: {
    async fetchPhotos() {
      try {
        this.loading = true;
        this.error = null;

        if (!this.lastFetch || Date.now() - this.lastFetch > 3600000) {
          const [games, characters] = await Promise.all([
            searchImages("video games", "games", 15),
            searchImages("video game characters", "characters", 15),
          ]);

          const processPhotos = (photos: IPhoto[], category: string) =>
            photos
              .filter((p) => p.category === category)
              .sort((a, b) => b.id - a.id)
              .slice(0, 10);

          this.allPhotos = [
            ...processPhotos(games, "games"),
            ...processPhotos(characters, "characters"),
          ];

          this.lastFetch = Date.now();
          this.saveToLocalStorage();
        }
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Błąd pobierania zdjęć";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    getPhotoById(id: number) {
      return this.allPhotos.find((photo) => photo.id === id);
    },

    addPhoto(newPhoto: IPhoto) {
      this.allPhotos.unshift(newPhoto);
      this.saveToLocalStorage();
    },

    updatePhoto(updatedPhoto: IPhoto) {
      const index = this.allPhotos.findIndex((p) => p.id === updatedPhoto.id);
      if (index !== -1) {
        this.allPhotos.splice(index, 1, updatedPhoto);
        this.saveToLocalStorage();
      }
    },

    deletePhoto(photoId: number) {
      this.allPhotos = this.allPhotos.filter((p) => p.id !== photoId);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("galleryPhotos", JSON.stringify(this.allPhotos));
    },

    loadFromLocalStorage() {
      const cached = localStorage.getItem("galleryPhotos");
      if (cached) {
        const parsed = JSON.parse(cached);
        this.allPhotos = parsed.sort((a: IPhoto, b: IPhoto) => b.id - a.id);
      }
    },
  },
  getters: {
    gamesPhotos: (state) =>
      state.allPhotos.filter((p) => p.category === "games").slice(0, 10),

    charactersPhotos: (state) =>
      state.allPhotos.filter((p) => p.category === "characters").slice(0, 10),
  },
});
