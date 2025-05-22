import { defineStore } from "pinia";

interface FormSubmission {
  nickname: string;
  gameTitle: string;
  hoursPlayed: number;
  review: string;
  textDocument?: File;
  screenshots?: File[];
  videoReview?: File;
}

// Funkcja do serializacji File
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

// Funkcja do deserializacji File
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
    ) as FormSubmission[],
  }),
  actions: {
    addSubmission(payload: FormSubmission) {
      this.submissions.push(payload);
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
