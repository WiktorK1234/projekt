<template>
  <div class="container my-5">
    <div class="text-center mb-5">
      <img
        src="/logo.jpg"
        alt="logo"
        class="img-fluid"
        style="max-height: 300px"
      />
    </div>

    <div class="alert alert-info mt-4 d-inline-block">
      <i class="bi bi-eye me-2"></i>
      {{ $t("home.visits") }}
      <strong>{{ visitCounter.visitCount }}</strong>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">{{ $t("home.welcomeTitle") }}</h2>
        <p class="card-text">{{ $t("home.welcomeText") }}</p>
      </div>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">{{ $t("home.title1") }}</h2>
        <p class="card-text">{{ $t("home.text1") }}</p>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item text-break">
            <i class="bi bi-controller text-success me-2"></i>
            {{ $t("home.bullet1") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-truck text-success me-2"></i
            >{{ $t("home.bullet2") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-cloud-download text-success me-2"></i
            >{{ $t("home.bullet3") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-star-fill text-success me-2"></i
            >{{ $t("home.bullet4") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-tags-fill text-success me-2"></i
            >{{ $t("home.bullet5") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-headset text-success me-2"></i
            >{{ $t("home.bullet6") }}
          </li>
        </ul>
        <p class="card-text">{{ $t("home.last1") }}</p>
      </div>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">{{ $t("home.title2") }}</h2>
        <p class="card-text">{{ $t("home.text2") }}</p>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i
            >{{ $t("home.bullet7") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i
            >{{ $t("home.bullet8") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i
            >{{ $t("home.bullet9") }}
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i
            >{{ $t("home.bullet10") }}
          </li>
        </ul>
        <p class="card-text">{{ $t("home.last2") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useVisitCounterStore } from "@/stores/visitCounter";

const visitCounter = useVisitCounterStore();

onMounted(() => {
  console.info("[Home] Komponent zamontowany");
  console.debug("[Home] Aktualny stan licznika:", visitCounter.visitCount);

  visitCounter.increment();
  console.log("[Home] Zaktualizowano licznik:", visitCounter.visitCount);
});
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.card-title {
  font-weight: 600;
}

.list-group-item {
  border-left: none;
  border-right: none;
  padding: 0.75rem 1.25rem;
}
</style>
