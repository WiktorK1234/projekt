import { defineStore } from "pinia";
import { searchImages } from "@/api/pixabayAPI";
import { IPhoto } from "@/models/IPhoto";
import { useLoadingStore } from "@/stores/loading";

export const usePhotoStore = defineStore("photos", {
  state: () => ({
    allPhotos: [] as IPhoto[],
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null,
  }),

  actions: {
    async fetchPhotos() {
      const loading = useLoadingStore();
      try {
        loading.start();

        if (!this.lastFetch || Date.now() - this.lastFetch > 3600000) {
          const [games, characters] = await Promise.all([
            this.fetchCategory("video games", "games", 20),
            this.fetchCategory("video-game-character", "characters", 40),
          ]);

          this.allPhotos = [...games, ...characters];
          this.lastFetch = Date.now();
          this.saveToLocalStorage();

          console.log(
            "[Photos] Zaktualizowano zdjęcia:",
            this.allPhotos.length
          );
        }
      } catch (err) {
        this.error =
          "Błąd pobierania zdjęć. Odśwież stronę lub spróbuj później.";
        console.error(err);
      } finally {
        loading.stop();
      }
    },

    async fetchCategory(
      query: string,
      category: "games" | "characters",
      count: number
    ): Promise<IPhoto[]> {
      try {
        const response = await searchImages(query, count);
        
        return response.data.hits.map((img: any, index: number) => ({
          id: img.id + Date.now() + index, // Unikalne ID
          url: img.webformatURL || img.largeImageURL,
          user: img.user || "Anonymous",
          imageHeight: img.webformatHeight,
          imageWidth: img.webformatWidth,
          category: category
        } as IPhoto));
        
      } catch (error) {
        console.error(`Błąd pobierania ${category}:`, error);
        return [];
      }
    }

    filterCharacters(photos: IPhoto[]) {
      return photos.filter((p) => p.category === "characters");
    },

    getPhotoById(id: number): IPhoto | undefined {
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
        try {
          const parsed = JSON.parse(cached);
          this.allPhotos = parsed.filter(
            (photo: IPhoto) =>
              photo?.url?.startsWith("https://") &&
              (photo.category === "characters"
                ? !photo.url.toLowerCase().includes("chess")
                : true)
          );
        } catch (error) {
          console.error("Błąd parsowania cache:", error);
        }
      }
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
