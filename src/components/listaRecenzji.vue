<template>
  <div class="container my-5">
    <h2 class="text-primary mb-4">Zgłoszone recenzje</h2>

    <div
      v-for="(recenzja, index) in formStore.getSubmissions"
      :key="index"
      class="card shadow-sm mb-3"
    >
      <div class="card-body">
        <h5 class="card-title text-success">
          {{ recenzja.nickname }}
          <span class="text-muted small ms-2">
            o grze {{ recenzja.gameTitle }}
          </span>
          <span class="text-muted small ms-2">
            ({{ recenzja.hoursPlayed }} godzin)
          </span>
        </h5>

        <div class="mb-2">
          <p class="mb-1"><strong>Recenzja:</strong></p>
          <p class="text-break">{{ recenzja.review }}</p>
        </div>

        <div v-if="recenzja.textDocument" class="mb-2">
          <p class="mb-1"><strong>Załącznik:</strong></p>
          <span class="badge bg-info">
            {{ recenzja.textDocument.name }} ({{
              (recenzja.textDocument.size / 1024 / 1024).toFixed(2)
            }}MB)
          </span>
        </div>

        <div v-if="recenzja.screenshots" class="mb-2">
          <p class="mb-1"><strong>Zrzuty ekranu:</strong></p>
          <div
            v-for="(screenshot, i) in recenzja.screenshots"
            :key="i"
            class="badge bg-warning me-2"
          >
            {{ screenshot.name }}
          </div>
        </div>

        <div v-if="recenzja.videoReview" class="mt-2">
          <p class="mb-1"><strong>Wideo:</strong></p>
          <span class="badge bg-danger">
            {{ recenzja.videoReview.name }} ({{
              (recenzja.videoReview.size / 1024 / 1024).toFixed(2)
            }}MB)
          </span>
        </div>
      </div>
    </div>

    <div v-if="formStore.getSubmissions.length === 0" class="alert alert-info">
      Brak zgłoszonych recenzji
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from "../stores/formDane";
const formStore = useFormStore();
</script>
