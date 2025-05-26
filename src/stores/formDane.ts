import { defineStore } from "pinia";
import type ReviewSubmission from "@/models/IReview";

interface SerializedFile {
  __type: "File";
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const replacer = (key: string, value: any) => {
  if (value instanceof File) {
    return {
      __type: "File",
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    } as SerializedFile;
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
    return new File([], value.name, {
      type: value.type,
      lastModified: value.lastModified,
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
    async addSubmission(payload: ReviewSubmission): Promise<string> {
      return new Promise((resolve) => {
        const submission: ReviewSubmission = {
          ...payload,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        this.submissions.unshift(submission);
        this.saveToLocalStorage();
        resolve(submission.id);
      });
    },

    async updateSubmission(
      id: string,
      payload: ReviewSubmission
    ): Promise<void> {
      return new Promise((resolve) => {
        const index = this.submissions.findIndex((s) => s.id === id);
        if (index > -1) {
          this.submissions[index] = { ...payload, id };
          this.saveToLocalStorage();
        }
        resolve();
      });
    },

    async deleteSubmission(id: string): Promise<void> {
      return new Promise((resolve) => {
        this.submissions = this.submissions.filter((s) => s.id !== id);
        this.saveToLocalStorage();
        resolve();
      });
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
