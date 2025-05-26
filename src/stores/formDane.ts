import { defineStore } from "pinia";
import type ReviewSubmission from "@/models/IReview";

const replacer = (key: string, value: any) => {
  if (value instanceof File) {
    return {
      __type: "File",
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    };
  }
  if (Array.isArray(value) && value[0] instanceof File) {
    return value.map((file) => ({
      __type: "File",
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
  }
  return value;
};

const reviver = (key: string, value: any) => {
  if (value?.__type === "File") {
    const file = new File([], value.name, {
      type: value.type,
      lastModified: value.lastModified,
    });

    return new Proxy(file, {
      get(target, prop) {
        if (prop === "name") return value.name;
        if (prop === "size") return value.size;
        return target[prop as keyof File];
      },
    });
  }
  return value;
};

export const useFormStore = defineStore("formData", {
  state: () => ({
    submissions: JSON.parse(
      localStorage.getItem("submissions") || "[]",
      reviver
    ) as ReviewSubmission[],
  }),

  actions: {
    addSubmission(payload: ReviewSubmission) {
      if (LOGGER) {
        console.debug("[Store] Dodano nową recenzję:", {
          user: payload.nickname,
          game: payload.gameTitle,
          chars: payload.review?.length || 0,
        });
      }

      this.submissions.push(payload);
      this.saveToLocalStorage();
    },

    updateSubmission(index: number, payload: ReviewSubmission) {
      this.submissions[index] = payload;
      this.saveToLocalStorage();
    },

    deleteSubmission(index: number) {
      this.submissions.splice(index, 1);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem(
        "submissions",
        JSON.stringify(this.submissions, replacer)
      );
    },
  },

  getters: {
    getSubmissions: (state) => state.submissions,
  },
});
