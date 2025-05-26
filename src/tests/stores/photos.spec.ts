import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePhotoStore } from "@/stores/photos";

describe("Photo Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("filters invalid URLs when loading from cache", () => {
    const invalidData = [
      {
        id: 1,
        url: "http://insecure.com/img.jpg",
        user: "Test",
        imageWidth: 100,
        imageHeight: 100,
        category: "games",
      },
      {
        id: 2,
        url: "https://secure.com/img.jpg",
        user: "Test",
        imageWidth: 100,
        imageHeight: 100,
        category: "games",
      },
    ];

    localStorage.setItem("galleryPhotos", JSON.stringify(invalidData));
    const store = usePhotoStore();
    store.loadFromLocalStorage();

    expect(store.allPhotos).toHaveLength(1);
    expect(store.allPhotos[0].url).toBe("https://secure.com/img.jpg");
  });
});
