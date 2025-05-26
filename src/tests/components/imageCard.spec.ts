import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ImageCard from "@/components/imageCard.vue";
import { useLoadingStore } from "@/stores/loading";

vi.mock("@/stores/loading", () => ({
  useLoadingStore: vi.fn(() => ({
    isLoading: false,
  })),
}));

describe("ImageCard", () => {
  const mockProps = {
    id: "123",
    author: "Test User",
    url: "https://example.com/image.jpg",
  };

  it("renders correctly with props", () => {
    const wrapper = mount(ImageCard, { props: mockProps });

    expect(wrapper.find('[data-testid="image-card"]').exists()).toBe(true);
    expect(wrapper.find("img").attributes("src")).toBe(mockProps.url);
    expect(wrapper.find(".card-title").text()).toBe(mockProps.author);
  });

  it("emits select event on button click", async () => {
    const wrapper = mount(ImageCard, { props: mockProps });

    await wrapper.find('[data-testid="details-button"]').trigger("click");
    const emitted = wrapper.emitted("select");

    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([mockProps.id]);
  });

  it("shows loading state when global loading is active", () => {
    const loadingStore = useLoadingStore();
    loadingStore.isLoading = true;

    const wrapper = mount(ImageCard, { props: mockProps });
    expect(wrapper.find(".spinner-border").exists()).toBe(true);
  });

  it("applies hover styles on mouseover", async () => {
    const wrapper = mount(ImageCard, { props: mockProps });

    await wrapper.trigger("mouseover");
    expect(wrapper.classes()).toContain("shadow-lg");
  });

  it("does not render without url", () => {
    const wrapper = mount(ImageCard, {
      props: {
        ...mockProps,
        url: "",
      },
    });

    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("handles long author names", () => {
    const longAuthor = "A".repeat(100) + " 😊👍";
    const wrapper = mount(ImageCard, {
      props: {
        ...mockProps,
        author: longAuthor,
      },
    });

    expect(wrapper.find(".card-title").text()).toBe(longAuthor);
    expect(wrapper.find(".card-title").element.scrollWidth).toBeGreaterThan(0);
  });
});
