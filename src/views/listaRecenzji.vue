<template>
  <div class="container my-5">
    <!-- Modal autoryzacyjny -->
    <div
      class="modal fade"
      id="adminAuthModal"
      tabindex="-1"
      role="dialog"
      :aria-hidden="!isAdmin"
      aria-labelledby="authModalLabel"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="authModalLabel">
              <i class="bi bi-shield-lock me-2"></i>
              {{ $t("reviews.authorization") }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              :aria-label="$t('common.close')"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">{{ $t("reviews.password") }}</label>
              <input
                type="password"
                class="form-control"
                v-model.trim="adminPasswordInput"
                :placeholder="$t('reviews.enter')"
                @keyup.enter="handleAdminAuth"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ $t("common.cancel") }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleAdminAuth"
            >
              <i class="bi bi-key me-2"></i>{{ $t("reviews.login") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal potwierdzenia usunięcia -->
    <div
      class="modal fade"
      id="deleteConfirmationModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteModalLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ $t("reviews.deleteSuccess") }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              :aria-label="$t('common.close')"
            ></button>
          </div>
          <div class="modal-body">
            {{ $t("reviews.delete") }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ $t("common.cancel") }}
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-trash me-2"></i>{{ $t("reviews.deleteBtn") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nagłówek i przyciski admina -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary">
        <i class="bi bi-card-checklist me-3"></i>{{ $t("reviews.list") }}
      </h1>
      <div>
        <button
          v-if="!isAdmin"
          class="btn btn-outline-primary"
          @click="showAuthModal"
        >
          <i class="bi bi-shield-lock me-2"></i>{{ $t("reviews.admin") }}
        </button>
        <button v-else class="btn btn-outline-danger" @click="logoutAdmin">
          <i class="bi bi-box-arrow-right me-2"></i>{{ $t("reviews.logout") }}
        </button>
      </div>
    </div>

    <!-- Wyszukiwarka -->
    <div class="mb-4">
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          :placeholder="$t('reviews.searchPlaceholder')"
          v-model="searchQuery"
        />
      </div>
    </div>

    <!-- Lista recenzji -->
    <div class="row g-4">
      <div
        class="col-12"
        v-for="(review, index) in paginatedReviews"
        :key="index"
      >
        <div class="card shadow-sm h-100">
          <div class="card-header bg-info text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title mb-0">
                  {{ review.nickname }}
                  <span class="fs-6 fw-normal"
                    >{{ review.hoursPlayed }}{{ $t("reviews.hours") }}</span
                  >
                </h5>
                <p class="mb-0 small">{{ review.gameTitle }}</p>
              </div>
              <div class="btn-group">
                <button
                  class="btn btn-sm btn-outline-light"
                  @click="toggleEditMode(index)"
                  :disabled="editingIndex !== -1 && editingIndex !== index"
                >
                  <i
                    class="bi"
                    :class="editingIndex === index ? 'bi-save' : 'bi-pencil'"
                  ></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-light"
                  @click="handleDeleteReview(review.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <!-- Tryb edycji -->
            <div v-if="editingIndex === index" class="edit-mode">
              <textarea
                class="form-control mb-3"
                v-model="editContent"
                rows="5"
                :placeholder="$t('reviews.editPlaceholder')"
              ></textarea>
              <div class="d-flex gap-2 justify-content-end">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="cancelEdit"
                >
                  <i class="bi bi-x-circle me-2"></i>{{ $t("common.cancel") }}
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  @click="saveChanges(index)"
                >
                  <i class="bi bi-check-circle me-2"></i>
                  {{ $t("reviews.save") }}
                </button>
              </div>
            </div>

            <!-- Tryb podglądu -->
            <div v-else>
              <p class="card-text pre-formatted">{{ review.review }}</p>

              <div v-if="review.textDocument" class="mt-3">
                <p class="mb-1 small text-muted">{{ $t("reviews.doc") }}</p>
                <span class="badge bg-info">
                  <i class="bi bi-file-earmark-text me-2"></i>
                  {{ review.textDocument?.name || $t("reviews.noName") }}
                </span>
              </div>

              <div v-if="review.screenshots" class="mt-3">
                <p class="mb-1 small text-muted">
                  {{ $t("reviews.screenshots") }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(screenshot, i) in review.screenshots"
                    :key="i"
                    class="badge bg-warning text-dark"
                  >
                    <i class="bi bi-image me-2"></i>
                    {{ screenshot?.name || $t("reviews.noName") }}
                  </span>
                </div>
              </div>

              <div v-if="review.videoReview" class="mt-3">
                <p class="mb-1 small text-muted">{{ $t("reviews.video") }}</p>
                <span class="badge bg-danger">
                  <i class="bi bi-film me-2"></i>
                  {{ review.videoReview?.name || $t("reviews.noName") }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer bg-light">
            <small class="text-muted">
              {{ $t("reviews.submitted") }}
              {{ new Date(review.timestamp).toLocaleDateString("pl-PL") }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Brak recenzji -->
    <div
      v-if="formStore.submissions.length === 0"
      class="alert alert-info mt-4"
    >
      <i class="bi bi-info-circle me-2"></i>{{ $t("reviews.noSubmissions") }}
    </div>

    <!-- Paginacja -->
    <div class="d-flex justify-content-center mt-5" v-if="totalPages > 1">
      <nav aria-label="Page navigation">
        <ul class="pagination flex-wrap">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="currentPage--"
              :disabled="currentPage === 1"
            >
              &laquo; {{ $t("reviews.previous") }}
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="currentPage++"
              :disabled="currentPage === totalPages"
            >
              {{ $t("reviews.next") }} &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import { useFormStore } from "../stores/formDane";
import { useNotificationsStore } from "@/stores/notifications";
import { useLoadingStore } from "@/stores/loading";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const formStore = useFormStore();
const notifications = useNotificationsStore();
const loading = useLoadingStore();

// Zmienne reaktywne
const adminPasswordInput = ref("");
const isAdmin = ref(false);
const editingIndex = ref(-1);
const editContent = ref("");
const searchQuery = ref("");
const itemsPerPage = ref(8);
const currentPage = ref(1);
const reviewToDelete = ref<string | null>(null);

// Inicjalizacja modalów
let authModal: Modal | null = null;
let deleteModal: Modal | null = null;

// Computed properties
const filteredReviews = computed(() => {
  if (!searchQuery.value) return formStore.submissions;
  const query = searchQuery.value.toLowerCase();
  return formStore.submissions.filter(
    (review) =>
      review.nickname.toLowerCase().includes(query) ||
      review.gameTitle.toLowerCase().includes(query)
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredReviews.value.length / itemsPerPage.value)
);

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredReviews.value.slice(start, start + itemsPerPage.value);
});

// Metody
const showAuthModal = () => authModal?.show();

const handleAdminAuth = async () => {
  try {
    await loading.wrapAsync(
      new Promise((resolve, reject) => {
        if (adminPasswordInput.value === import.meta.env.VITE_ADMIN) {
          isAdmin.value = true;
          localStorage.setItem("adminSession", "active");
          resolve(true);
        } else {
          reject(new Error(t("reviews.authFailed")));
        }
      })
    );
    notifications.showToast("success", t("reviews.loginSuccess"));
    authModal?.hide();
  } catch (error) {
    notifications.showToast("error", (error as Error).message);
  } finally {
    adminPasswordInput.value = "";
  }
};

const logoutAdmin = () => {
  isAdmin.value = false;
  localStorage.removeItem("adminSession");
  notifications.showToast("success", t("reviews.logoutSuccess"));
};

const toggleEditMode = (index: number) => {
  if (!isAdmin.value) {
    showAuthModal();
    return;
  }
  editingIndex.value = editingIndex.value === index ? -1 : index;
  editContent.value = filteredReviews.value[index].review;
};

const cancelEdit = () => {
  editingIndex.value = -1;
  editContent.value = "";
};

const saveChanges = async (index: number) => {
  try {
    const review = formStore.submissions[index];
    const updatedReview = {
      ...review,
      review: editContent.value,
    };

    await formStore.updateSubmission(review.id, updatedReview);

    notifications.showToast("success", t("notifications.saveSuccess"), {
      title: t("notifications.successTitle"),
      timeout: 4000,
    });

    editingIndex.value = -1;
  } catch (error) {
    notifications.showToast("error", t("notifications.saveError"), {
      title: t("notifications.errorTitle"),
      timeout: 6000,
    });
  }
};

const handleDeleteReview = (id: string) => {
  reviewToDelete.value = id;
  deleteModal?.show();
};

const confirmDelete = async () => {
  if (reviewToDelete.value !== null) {
    try {
      await formStore.deleteSubmission(reviewToDelete.value);
      notifications.showToast("success", t("notifications.deleteSuccess"), {
        title: t("notifications.successTitle"),
        timeout: 4000,
      });
    } catch (error) {
      notifications.showToast("error", t("notifications.deleteError"), {
        title: t("notifications.errorTitle"),
        timeout: 6000,
      });
    } finally {
      deleteModal?.hide();
      reviewToDelete.value = null;
    }
  }
};

onMounted(() => {
  authModal = new Modal("#adminAuthModal");
  deleteModal = new Modal("#deleteConfirmationModal");
  isAdmin.value = localStorage.getItem("adminSession") === "active";
});

watch(searchQuery, () => (currentPage.value = 1));
</script>

<style scoped>
.pre-formatted {
  white-space: pre-wrap;
}

.alert-success {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.bi {
  vertical-align: middle;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

@media (max-width: 576px) {
  .page-item {
    margin: 2px;
    flex-grow: 1;
    text-align: center;
  }

  .page-link {
    padding: 0.5rem;
  }
}
</style>
