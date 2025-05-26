import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import Gallery from "@/views/gallery.vue";
import { usePhotoStore } from "@/stores/photos";
import { searchImages } from "@/api/pixabayAPI";

vi.mock("@/api/pixabayAPI", () => ({
  searchImages: vi.fn().mockResolvedValue([
    {
      id: 1,
      url: "https://test.com/photo1.jpg",
      user: "User1",
      imageWidth: 800,
      imageHeight: 600,
      category: "games",
    },
    {
      id: 2,
      url: "https://test.com/photo2.jpg",
      user: "User2",
      imageWidth: 1024,
      imageHeight: 768,
      category: "characters",
    },
  ]),
}));

describe("Gallery", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders loading state", () => {
    const photoStore = usePhotoStore();
    photoStore.loading = true;

    const wrapper = mount(Gallery);
    expect(wrapper.find(".spinner-border").exists()).toBe(true);
  });

  it("displays error message", async () => {
    const photoStore = usePhotoStore();
    photoStore.error = "Test error message";

    const wrapper = mount(Gallery);
    expect(wrapper.find(".alert-danger").text()).toContain(
      "Test error message"
    );
  });

  it("loads photos from API", async () => {
    const photoStore = usePhotoStore();
    await photoStore.fetchPhotos();

    const wrapper = mount(Gallery);
    await flushPromises();

    expect(searchImages).toHaveBeenCalled();
    expect(wrapper.findAll('[data-testid="image-card"]')).toHaveLength(2);
  });

  it("shows empty state when no photos", async () => {
    const photoStore = usePhotoStore();
    photoStore.allPhotos = [];

    const wrapper = mount(Gallery);
    expect(wrapper.find(".alert-warning").exists()).toBe(true);
  });

  it("navigates to photo details on select", async () => {
    const mockRouter = {
      push: vi.fn(),
    };

    const wrapper = mount(Gallery, {
      global: {
        mocks: {
          $router: mockRouter,
        },
      },
    });

    await wrapper
      .findComponent({ name: "ImageCard" })
      .vm.$emit("select", "123");
    expect(mockRouter.push).toHaveBeenCalledWith("/photo/123");
  });

  it("uses cached photos if available", async () => {
    const photoStore = usePhotoStore();
    photoStore.allPhotos = [
      {
        id: 999,
        url: "https://cached.com/photo.jpg",
        user: "Cached User",
        imageWidth: 400,
        imageHeight: 300,
        category: "games",
      },
    ];

    const wrapper = mount(Gallery);
    await nextTick();

    expect(wrapper.findAll('[data-testid="image-card"]')).toHaveLength(1);
    expect(searchImages).not.toHaveBeenCalled();
  });

  it("handles invalid API response with empty URL", async () => {
    vi.mocked(searchImages).mockResolvedValueOnce([
      {
        id: 1,
        url: "",
        user: "User1",
        imageWidth: 800,
        imageHeight: 600,
        category: "games",
      },
    ]);

    const wrapper = mount(Gallery);
    await flushPromises();

    expect(wrapper.findAll('[data-testid="image-card"]')).toHaveLength(0);
  });
});
