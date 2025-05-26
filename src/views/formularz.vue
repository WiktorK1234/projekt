<template>
  <div class="container my-5">
    <div class="card shadow-sm mb-5">
      <div class="card-body text-center">
        <h1 class="card-title text-primary">
          <i class="bi bi-controller me-2"></i>
          {{ $t("form.title") }}
        </h1>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <p class="lead">{{ $t("form.description") }}</p>
      </div>
    </div>

    <h2 class="text-primary mb-4">{{ $t("form.formTitle") }}</h2>
    <form @submit.prevent="onSubmit" :key="`${formKey}_${locale}`">
      <div class="mb-3">
        <label for="gameTitle" class="form-label">{{
          $t("form.gameTitle")
        }}</label>
        <div class="input-group">
          <Field
            name="gameTitle"
            type="text"
            class="form-control"
            list="gameSuggestions"
            :placeholder="$t('form.gameTitlePlaceholder')"
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
          {{ $t("form.nickname") }}
          <span class="text-muted small">{{ $t("form.required") }}</span>
        </label>
        <Field
          type="text"
          class="form-control"
          name="nickname"
          :placeholder="$t('form.nicknamePlaceholder')"
          rules="required|min:3"
        />
        <ErrorMessage name="nickname" class="text-danger small d-block mt-1" />
      </div>

      <div class="mb-3">
        <label for="hoursPlayed" class="form-label">
          {{ $t("form.hoursPlayed") }}
          <span class="text-muted small">{{ $t("form.required") }}</span>
        </label>
        <Field
          type="number"
          class="form-control"
          name="hoursPlayed"
          min="1"
          max="10000"
          :placeholder="$t('form.hoursPlaceholder')"
        />
        <ErrorMessage
          name="hoursPlayed"
          class="text-danger small d-block mt-1"
        />
      </div>

      <div class="mb-3">
        <label for="review" class="form-label">
          {{ $t("form.review") }}
          <span class="text-muted small" v-if="hasTextDocument">{{
            $t("form.optional")
          }}</span>
          <span class="text-muted small" v-else>{{
            $t("form.reviewRequirements")
          }}</span>
        </label>
        <Field
          as="textarea"
          class="form-control"
          name="review"
          rows="5"
          :placeholder="$t('form.reviewPlaceholder')"
        />
        <ErrorMessage name="review" class="text-danger small d-block mt-1" />
      </div>

      <div class="mb-3">
        <label for="textDocument" class="form-label">
          {{ $t("form.textDocument") }}
        </label>
        <Field
          type="file"
          class="form-control"
          name="textDocument"
          :key="'doc_' + locale"
          accept=".doc,.docx,.pdf"
          @change="handleFileChange"
        />
        <ErrorMessage
          name="textDocument"
          class="text-danger small d-block mt-1"
        />
        <div class="small text-muted mt-1">
          {{ values.textDocument?.name || $t("form.noFileChosen") }}
        </div>
      </div>

      <div class="mb-3">
        <label for="screenshots" class="form-label">
          {{ $t("form.screenshots") }}
        </label>
        <Field
          type="file"
          class="form-control"
          name="screenshots"
          :key="'screenshots_' + locale"
          accept="image/*"
          multiple
          @change="(e) => handleFileChange(e, 'screenshots')"
        />
        <ErrorMessage
          name="screenshots"
          class="text-danger small d-block mt-1"
        />
        <div class="small text-muted mt-1">
          {{
            values.screenshots?.length > 0
              ? $t("form.chooseFile", { count: values.screenshots.length })
              : $t("form.noFileChosen")
          }}
        </div>
      </div>

      <div class="mb-4">
        <label for="videoReview" class="form-label">
          {{ $t("form.videoReview") }}
        </label>
        <Field
          type="file"
          class="form-control"
          name="videoReview"
          :key="'video_' + locale"
          accept="video/*"
          @change="(e) => handleFileChange(e, 'videoReview')"
        />
        <ErrorMessage
          name="videoReview"
          class="text-danger small d-block mt-1"
        />
        <div class="small text-muted mt-1">
          {{
            values.videoReview
              ? $t("form.fileChosen", { name: values.videoReview.name })
              : $t("form.noFileChosen")
          }}
        </div>
      </div>

      <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
        <button
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="cancel"
        >
          <i class="bi bi-x-circle me-2"></i>
          {{ $t("common.cancel") }}
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!meta.valid || isSubmitting"
        >
          <i class="bi bi-send-fill me-2"></i>
          {{ isSubmitting ? $t("form.submitting") : $t("form.submit") }}
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
import { useNotificationsStore } from "@/stores/notifications";
import { useLoadingStore } from "@/stores/loading";
import ReviewSubmission from "@/models/IReview";
import { useI18n } from "vue-i18n";

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
const { t, locale } = useI18n();

const validationSchema = computed(() =>
  yup.object({
    gameTitle: yup.string().required(t("form.validation.gameTitleRequired")),
    nickname: yup
      .string()
      .required(t("form.nicknameRequired"))
      .min(3, t("form.nicknameMin"))
      .matches(/^[a-zA-Z0-9_]+$/, t("form.nicknamePattern")),
    hoursPlayed: yup
      .number()
      .typeError(t("form.hoursTypeError"))
      .min(1, t("form.hoursMin"))
      .max(10000, t("form.hoursMax"))
      .required(t("form.required")),
    review: yup.string().when("textDocument", {
      is: (file: File) => !file,
      then: (schema) =>
        schema.required(t("form.reviewRequired")).min(500, t("form.reviewMin")),
      otherwise: (schema) => schema,
    }),
    textDocument: yup
      .mixed()
      .test(
        "fileSize",
        t("form.fileSize"),
        (value) => !value || value.size <= 5 * 1024 * 1024
      )
      .test(
        "fileType",
        t("form.fileTypeDocs"),
        (value) =>
          !value ||
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(value.type)
      ),
    screenshots: yup
      .mixed()
      .test(
        "fileSize",
        t("form.fileSize"),
        (value) =>
          !value ||
          Array.from(value).every((file: File) => file.size <= 5 * 1024 * 1024)
      )
      .test(
        "fileType",
        t("form.fileTypeImages"),
        (value) =>
          !value ||
          Array.from(value).every((file: File) =>
            ["image/jpeg", "image/png"].includes(file.type)
          )
      ),
    videoReview: yup
      .mixed()
      .test(
        "fileSize",
        t("form.videoFileSize"),
        (value) => !value || value.size <= 100 * 1024 * 1024
      )
      .test(
        "fileType",
        t("form.fileTypeVideo"),
        (value) =>
          !value || ["video/mp4", "video/x-msvideo"].includes(value.type)
      ),
  })
);

const { handleSubmit, resetForm, meta, setFieldValue, values } = useForm({
  validationSchema: validationSchema.value,
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

    const submissionData: ReviewSubmission = {
      gameTitle: values.gameTitle,
      nickname: values.nickname,
      hoursPlayed: Number(values.hoursPlayed),
      timestamp: Date.now(),
      review: values.review,
      textDocument: values.textDocument,
      screenshots: values.screenshots,
      videoReview: values.videoReview,
    };
    await formStore.addSubmission(submissionData);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    resetForm();

    setFieldValue("textDocument", null);
    setFieldValue("screenshots", null);
    setFieldValue("videoReview", null);
    textDocumentFile.value = null;

    formKey.value++;
    notifications.showToast("success", t("notifications.submitSuccess"), {
      title: t("notifications.successTitle"),
    });
  } catch (error) {
    console.error(error);
    notifications.showToast("error", t("notifications.submitError"), {
      title: t("notifications.errorTitle"),
    });
  } finally {
    loading.stop();
    isSubmitting.value = false;
  }
});

const cancel = () => {
  resetForm();
  textDocumentFile.value = null;
};

const handleFileChange = (event: Event, field: string) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files) {
    setFieldValue(field, input.multiple ? Array.from(files) : files[0]);
  }
};

watch(locale, () => {
  setFieldValue("textDocument", null);
  setFieldValue("screenshots", null);
  setFieldValue("videoReview", null);

  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input: HTMLInputElement) => {
    input.value = "";
  });

  formKey.value++;
});
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
