<template>
  <div class="container my-5">
    <div class="card shadow-sm mb-5">
      <div class="card-body text-center">
        <h1 class="card-title text-primary">
          <i class="bi bi-controller me-2"></i>
          Zgłoś swoją recenzję gry!
        </h1>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <p class="lead">
          Podziel się swoją opinią o najnowszych tytułach! Najlepsze recenzje
          zostaną opublikowane na naszym portalu i nagrodzone zestawami
          gamingowymi.
        </p>
      </div>
    </div>

    <h2 class="text-primary mb-4">Formularz recenzji</h2>
    <form @submit.prevent="onSubmit" :key="formKey">
      <div class="mb-3">
        <label for="gameTitle" class="form-label">Tytuł gry</label>
        <div class="input-group">
          <Field
            name="gameTitle"
            type="text"
            class="form-control"
            list="gameSuggestions"
            placeholder="Wpisz lub wybierz tytuł gry..."
            rules="required"
          />
        </div>
        <datalist id="gameSuggestions">
          <option v-for="game in popularGames" :key="game">{{ game }}</option>
        </datalist>
        <ErrorMessage name="gameTitle" class="text-danger small d-block mt-1" />
      </div>

      <div class="mb-3">
        <label for="nickname" class="form-label">
          Twój gamingowy nick
          <span class="text-muted small">(wymagane)</span>
        </label>
        <Field
          type="text"
          class="form-control"
          name="nickname"
          placeholder="Podaj swój pseudonim..."
          rules="required|min:3"
        />
        <ErrorMessage name="nickname" class="text-danger small d-block mt-1" />
      </div>

      <div class="mb-3">
        <label for="hoursPlayed" class="form-label">
          Liczba godzin rozgrywki
          <span class="text-muted small">(wymagane)</span>
        </label>
        <Field
          type="number"
          class="form-control"
          name="hoursPlayed"
          min="1"
          max="10000"
          placeholder="Podaj liczbę godzin..."
        />
        <ErrorMessage
          name="hoursPlayed"
          class="text-danger small d-block mt-1"
        />
      </div>

      <div class="mb-3">
        <label for="review" class="form-label">
          Recenzja
          <span class="text-muted small" v-if="hasTextDocument"
            >(opcjonalne)</span
          >
          <span class="text-muted small" v-else
            >(wymagane, min. 500 znaków)</span
          >
        </label>
        <Field
          as="textarea"
          class="form-control"
          name="review"
          rows="5"
          placeholder="Opisz swoje doświadczenia z grą..."
        />
        <ErrorMessage name="review" class="text-danger small d-block mt-1" />
      </div>

      <div class="mb-3">
        <label for="textDocument" class="form-label">
          Załącznik tekstowy (opcjonalny, .doc/.docx/.pdf, max 5MB)
        </label>
        <Field
          type="file"
          class="form-control"
          name="textDocument"
          accept=".doc,.docx,.pdf"
          @change="(e) => handleFileUpload(e, 'textDocument')"
        />
        <ErrorMessage
          name="textDocument"
          class="text-danger small d-block mt-1"
        />
      </div>

      <div class="mb-3">
        <label for="screenshots" class="form-label"
          >Zrzuty ekranu (opcjonalne, max 5MB, JPG/PNG/MP4)</label
        >
        <Field
          type="file"
          class="form-control"
          name="screenshots"
          accept="image/*, video/*"
          multiple
          @change="(e) => handleFileUpload(e, 'screenshots')"
        />
        <ErrorMessage
          name="screenshots"
          class="text-danger small d-block mt-1"
        />
      </div>

      <div class="mb-4">
        <label for="videoReview" class="form-label"
          >Recenzja wideo (opcjonalna, max 100MB, MP4/AVI)</label
        >
        <Field
          type="file"
          class="form-control"
          name="videoReview"
          accept="video/*"
          @change="(e) => handleFileUpload(e, 'videoReview')"
        />
        <ErrorMessage
          name="videoReview"
          class="text-danger small d-block mt-1"
        />
      </div>

      <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
        <button
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="cancel"
        >
          <i class="bi bi-x-circle me-2"></i> Anuluj
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!meta.valid || isSubmitting"
        >
          <i class="bi bi-send-fill me-2"></i>
          {{ isSubmitting ? "Wysyłanie..." : "Opublikuj recenzję" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useFormStore } from "../stores/formDane";
import { useNotificationsStore } from "@/stores/notyfikacje";
import { useLoadingStore } from "@/stores/loading";

const formStore = useFormStore();

const popularGames = ref([
  "Cyberpunk 2077",
  "The Witcher 3: Wild Hunt",
  "Elden Ring",
  "God of War: Ragnarök",
  "Horizon Forbidden West",
]);

const textDocumentFile = ref<File | null>(null);
const isSubmitting = ref(false);
const notifications = useNotificationsStore();
const hasTextDocument = computed(() => !!textDocumentFile.value);
const formKey = ref(0);

const schema = yup.object({
  gameTitle: yup.string().required("Podaj tytuł gry"),
  nickname: yup
    .string()
    .required("Podaj swój nick")
    .min(3, "Minimum 3 znaki")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Dozwolone znaki: litery, cyfry i podkreślenia"
    ),
  hoursPlayed: yup
    .number()
    .typeError("Podaj poprawną liczbę godzin")
    .min(1, "Minimum 1 godzina rozgrywki")
    .max(10000, "Maksymalnie 10,000 godzin")
    .required("Pole wymagane"),
  review: yup.string().when("textDocument", {
    is: (file: File) => !file,
    then: () =>
      yup
        .string()
        .required("Recenzja jest wymagana")
        .min(500, "Minimum 500 znaków"),
    otherwise: () => yup.string(),
  }),
  textDocument: yup
    .mixed()
    .test("fileSize", "Maksymalny rozmiar pliku: 5MB", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Dopuszczalne formaty: DOC, DOCX, PDF", (value) => {
      if (!value) return true;
      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(value.type);
    }),
  screenshots: yup
    .mixed()
    .test("fileSize", "Maksymalny rozmiar pliku: 5MB", (value) => {
      if (!value) return true;
      return Array.from(value as File[]).every(
        (file) => file.size <= 5 * 1024 * 1024
      );
    })
    .test("fileType", "Dopuszczalne formaty: JPG, PNG, MP4", (value) => {
      if (!value) return true;
      return Array.from(value as File[]).every((file) =>
        ["image/jpeg", "image/png", "video/mp4"].includes(file.type)
      );
    }),
  videoReview: yup
    .mixed()
    .test("fileSize", "Maksymalny rozmiar pliku: 100MB", (value) => {
      if (!value) return true;
      return (value as File).size <= 100 * 1024 * 1024;
    })
    .test("fileType", "Dopuszczalne formaty: MP4, AVI", (value) => {
      if (!value) return true;
      return ["video/mp4", "video/x-msvideo"].includes((value as File).type);
    }),
});

const { handleSubmit, resetForm, meta, setFieldValue } = useForm({
  validationSchema: schema,
});

const handleFileUpload = (event: Event, fieldName: string) => {
  const input = event.target as HTMLInputElement;
  const files = input.multiple ? input.files : input.files?.[0] || null;
  setFieldValue(fieldName, files);
  if (fieldName === "textDocument") {
    textDocumentFile.value = files as File | null;
  }
};

const onSubmit = handleSubmit(async (values) => {
  const loading = useLoadingStore();
  isSubmitting.value = true;
  try {
    loading.start();
    const submissionData = {
      gameTitle: values.gameTitle,
      nickname: values.nickname,
      hoursPlayed: Number(values.hoursPlayed),
      timestamp: Date.now(),
      review: values.review,
      textDocument: values.textDocument,
      screenshots: values.screenshots,
      videoReview: values.videoReview,
    };

    formStore.addSubmission(submissionData);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    resetForm();

    setFieldValue("textDocument", null);
    setFieldValue("screenshots", null);
    setFieldValue("videoReview", null);
    textDocumentFile.value = null;

    formKey.value++;
    notifications.showToast("success", "Recenzja została pomyślnie wysłana!", {
      title: "Sukces!",
      timeout: 4000,
    });
  } catch (error) {
    notifications.showToast(
      "error",
      "Wystąpił błąd podczas wysyłania recenzji.",
      {
        title: "Błąd!",
      }
    );
  } finally {
    loading.stop();
    isSubmitting.value = false;
  }
});

const cancel = () => {
  resetForm();
  textDocumentFile.value = null;
};
</script>

<style scoped>
.alert-success {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 576px) {
  .form-label {
    font-size: 0.9rem !important;
  }

  .form-control {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.85rem;
  }
}
</style>
