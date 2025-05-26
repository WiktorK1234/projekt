import { config } from "@vue/test-utils";
import { vi } from "vitest";

vi.mock("@/stores/notifications", () => ({
  useNotificationsStore: vi.fn(() => ({
    showToast: vi.fn(),
    removeToast: vi.fn(),
    toasts: [],
  })),
}));

config.global.mocks = {
  $route: {
    params: {},
  },
  $router: {
    push: vi.fn(),
  },
};

vi.stubEnv("VITE_kluczAPI", "testowy_klucz_api");
