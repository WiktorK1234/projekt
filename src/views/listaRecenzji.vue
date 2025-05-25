<template>
  <div class="container my-5">
    <div class="modal fade" id="adminAuthModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-shield-lock me-2"></i>
              Autoryzacja administratora
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Hasło administratora:</label>
              <input
                type="password"
                class="form-control"
                v-model="adminPasswordInput"
                placeholder="Wprowadź hasło dostępu"
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
              Anuluj
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleAdminAuth"
            >
              <i class="bi bi-key me-2"></i>Zaloguj
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Potwierdzenie usunięcia
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            Czy na pewno chcesz usunąć tę recenzję? Tej operacji nie można
            cofnąć!
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Anuluj
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-trash me-2"></i>
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary">
        <i class="bi bi-card-checklist me-3"></i>
        Lista zgłoszonych recenzji
      </h1>
      <div>
        <button
          v-if="!isAdmin"
          class="btn btn-outline-primary"
          @click="authModal?.show()"
        >
          <i class="bi bi-shield-lock me-2"></i>
          Logowanie administratora
        </button>
        <button v-else class="btn btn-outline-danger" @click="logoutAdmin">
          <i class="bi bi-box-arrow-right me-2"></i>
          Wyloguj
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="Wyszukaj recenzje po autorze lub tytule gry..."
          v-model="searchQuery"
        />
      </div>
    </div>

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
                    >({{ review.hoursPlayed }} godzin gry)</span
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
                  @click="handleDeleteReview(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <div v-if="editingIndex === index" class="edit-mode">
              <textarea
                class="form-control mb-3"
                v-model="editContent"
                rows="5"
                placeholder="Wprowadź nową treść recenzji..."
              ></textarea>

              <div class="d-flex gap-2 justify-content-end">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="cancelEdit"
                >
                  <i class="bi bi-x-circle me-2"></i>Anuluj
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  @click="saveChanges(index)"
                >
                  <i class="bi bi-check-circle me-2"></i>Zapisz zmiany
                </button>
              </div>
            </div>

            <div v-else>
              <p class="card-text pre-formatted">{{ review.review }}</p>

              <div v-if="review.textDocument" class="mt-3">
                <p class="mb-1 small text-muted">Załączony dokument:</p>
                <span class="badge bg-info">
                  <i class="bi bi-file-earmark-text me-2"></i>
                  {{ review.textDocument?.name || "Brak nazwy" }}
                  <span class="ms-2"
                    >({{ formatSize(review.textDocument?.size) }})</span
                  >
                </span>
              </div>

              <div v-if="review.screenshots" class="mt-3">
                <p class="mb-1 small text-muted">Zrzuty ekranu:</p>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(screenshot, i) in review.screenshots"
                    :key="i"
                    class="badge bg-warning text-dark"
                  >
                    <i class="bi bi-image me-2"></i>
                    {{ screenshot?.name || "Brak nazwy" }} ({{
                      formatSize(screenshot?.size)
                    }})
                  </span>
                </div>
              </div>

              <div v-if="review.videoReview" class="mt-3">
                <p class="mb-1 small text-muted">Recenzja wideo:</p>
                <span class="badge bg-danger">
                  <i class="bi bi-film me-2"></i>
                  {{ review.videoReview?.name || "Brak nazwy" }} ({{
                    formatSize(review.videoReview?.size)
                  }})
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer bg-light">
            <small class="text-muted">
              Zgłoszono:
              {{ new Date(review.timestamp).toLocaleDateString("pl-PL") }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="formStore.submissions.length === 0"
      class="alert alert-info mt-4"
    >
      <i class="bi bi-info-circle me-2"></i>
      Brak zgłoszonych recenzji do wyświetlenia
    </div>

    <div class="d-flex justify-content-center mt-5" v-if="totalPages > 1">
      <nav aria-label="Nawigacja paginacji">
        <ul class="pagination flex-wrap">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="currentPage = currentPage - 1"
              :disabled="currentPage === 1"
            >
              &laquo; Poprzednia
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
              @click="currentPage = currentPage + 1"
              :disabled="currentPage === totalPages"
            >
              Następna &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Modal } from "bootstrap";
import { useFormStore } from "../stores/formDane";
import { useNotificationsStore } from "@/stores/notyfikacje";
import { useLoadingStore } from "@/stores/loading";

const formStore = useFormStore();
const adminPasswordInput = ref("");
const isAdmin = ref(localStorage.getItem("adminSession") === "active");
const editingIndex = ref(-1);
const editContent = ref("");
const notifications = useNotificationsStore();
const reviewToDelete = ref<number | null>(null);
const searchQuery = ref("");
const itemsPerPage = ref(8);
const currentPage = ref(1);
const loading = useLoadingStore();

let authModal: Modal | null = null;
let deleteModal: Modal | null = null;

const formatSize = (bytes: number | undefined) => {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, exp)).toFixed(1);
  return `${size} ${units[exp]}`;
};

const handleAdminAuth = async () => {
  try {
    await loading.wrapAsync(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (adminPasswordInput.value === import.meta.env.VITE_admin) {
            resolve(true);
            isAdmin.value = true;
            localStorage.setItem("adminSession", "active");
          } else {
            reject(new Error("Invalid password"));
          }
        }, 800);
      })
    );
    authModal?.hide();
  } catch (error) {
    notifications.showToast("error", "Nieprawidłowe hasło administratora!");
    adminPasswordInput.value = "";
  }
};

const logoutAdmin = () => {
  isAdmin.value = false;
  localStorage.removeItem("adminSession");
  authModal?.hide();
};

const filteredReviews = computed(() => {
  if (!searchQuery.value) return formStore.submissions;

  const query = searchQuery.value.toLowerCase();
  return formStore.submissions.filter((review) => {
    return (
      review.nickname.toLowerCase().includes(query) ||
      review.gameTitle.toLowerCase().includes(query)
    );
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredReviews.value.length / itemsPerPage.value)
);

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredReviews.value.slice(start, end);
});

const toggleEditMode = (index: number) => {
  if (!isAdmin.value) {
    authModal?.show();
    return;
  }

  editingIndex.value = editingIndex.value === index ? -1 : index;
  editContent.value = filteredReviews.value[index].review;
};

const saveChanges = async (index: number) => {
  try {
    await loading.wrapAsync(
      formStore.updateSubmission(index, {
        ...formStore.submissions[index],
        review: editContent.value,
      })
    );
    notifications.showToast("success", "Zmiany zapisano pomyślnie!");

    editingIndex.value = -1;
    editContent.value = "";
  } catch (error) {
    notifications.showToast("error", "Błąd podczas zapisywania zmian");
  }
};

const cancelEdit = () => {
  editingIndex.value = -1;
  editContent.value = "";
};

const handleDeleteReview = (index: number) => {
  if (!isAdmin.value) {
    authModal?.show();
    return;
  }

  reviewToDelete.value = index;
  deleteModal?.show();
};

const confirmDelete = () => {
  if (reviewToDelete.value !== null) {
    formStore.deleteSubmission(reviewToDelete.value);
    deleteModal?.hide();
    reviewToDelete.value = null;
  }
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  console.info("[Recenzje] Komponent zamontowany");

  authModal = new Modal("#adminAuthModal");
  deleteModal = new Modal("#deleteConfirmationModal");
  console.debug("[Recenzje] Zainicjowano modale:", authModal, deleteModal);
});
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
