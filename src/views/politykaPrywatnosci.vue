<template>
  <div class="container py-3 py-md-5">
    <h1 class="mb-3 mb-md-4 text-center text-md-start">
      {{ $t("privacy.title") }}
    </h1>

    <div class="card shadow-lg">
      <div class="card-body p-3 p-md-4">
        <h2 class="h4 mb-2 mb-md-3">{{ $t("privacy.section1") }}</h2>
        <p class="text-justify">{{ $t("privacy.section1Text") }}</p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">
          {{ $t("privacy.section2") }}
        </h2>
        <p class="text-justify">{{ $t("privacy.section2Text") }}</p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">
          {{ $t("privacy.section3") }}
        </h2>
        <p class="text-justify">{{ $t("privacy.section3Text") }}</p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">
          {{ $t("privacy.section4") }}
        </h2>
        <p class="text-justify">{{ $t("privacy.section4Text") }}</p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">
          {{ $t("privacy.section5") }}
        </h2>
        <p class="text-justify">{{ $t("privacy.section5Text") }}</p>

        <div class="mt-3 mt-md-4 p-2 p-md-3 bg-light rounded">
          <p class="mb-0 small">{{ $t("privacy.recent") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  metaInfo: {
    title: "Polityka Prywatności",
  },
};
</script>

<style scoped>
.card {
  border-radius: 15px;
  border: none;
}

.h4 {
  color: #2c3e50;
  font-weight: 600;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.75rem;
  }

  .h4 {
    font-size: 1.25rem;
  }

  .card-body {
    padding: 1rem !important;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.5rem;
  }

  .h4 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.95rem;
  }
}

.dark-mode h1,
.dark-mode .h4,
.dark-mode .card-title {
  color: #e0e0e0 !important;
}

.dark-mode h1 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.dark-mode .h4 {
  position: relative;
  padding-left: 15px;
}

.dark-mode .h4::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  background: var(--bs-primary);
  border-radius: 2px;
}

.dark-mode .text-muted {
  color: #b0b0b0 !important;
}

.dark-mode .bg-light {
  background-color: #333 !important;
  border-color: #444 !important;
}
</style>
