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
      Liczba unikalnych odwiedzin:
      <strong>{{ visitCounter.visitCount }}</strong>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">Witamy w GameZone</h2>
        <p class="card-text">
          GameZone to miejsce stworzone z myślą o wszystkich miłośnikach gier —
          od fanów klasycznych gier planszowych po zapalonych graczy konsolowych
          i PC. Znajdziesz u nas zarówno gry w wersji fizycznej, jak i cyfrowej,
          gotowe do pobrania od razu po zakupie.
        </p>
      </div>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">Dlaczego warto kupować u nas?</h2>
        <p class="card-text">
          W GameZone stawiamy na jakość, wygodę i szeroki wybór. Oferujemy gry
          na najpopularniejsze platformy oraz unikalne edycje kolekcjonerskie.
        </p>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item text-break">
            <i class="bi bi-controller text-success me-2"></i>
            Gry cyfrowe i fizyczne w jednym miejscu
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-truck text-success me-2"></i>
            Szybka i bezpieczna dostawa produktów fizycznych
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-cloud-download text-success me-2"></i>
            Natychmiastowy dostęp do gier cyfrowych
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-star-fill text-success me-2"></i>
            Tylko sprawdzone i wysoko oceniane tytuły
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-tags-fill text-success me-2"></i>
            Regularne promocje i oferty specjalne
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-headset text-success me-2"></i>
            Pomoc techniczna i wsparcie klienta 7 dni w tygodniu
          </li>
        </ul>
        <p class="card-text">
          Dołącz do setek zadowolonych graczy i przekonaj się, że zakupy z
          GameZone to czysta przyjemność!
        </p>
      </div>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-info">Nasze atuty</h2>
        <p class="card-text">
          Tworzymy sklep z pasji do grania. Wspieramy zarówno największe
          wydawnictwa, jak i niezależnych twórców.
        </p>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i>
            Bogata biblioteka gier na różne platformy
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i>
            Atrakcyjne ceny i program lojalnościowy
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i>
            Intuicyjny interfejs i łatwość zakupów
          </li>
          <li class="list-group-item text-break">
            <i class="bi bi-award text-success me-2"></i>
            Społeczność graczy dzieląca się recenzjami i opiniami
          </li>
        </ul>
        <p class="card-text">
          Zajrzyj do naszej galerii, poznaj szczegóły gier i skorzystaj z
          formularza, aby się z nami skontaktować. Granie zaczyna się tutaj!
        </p>
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
