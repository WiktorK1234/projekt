<template>
  <div class="container py-3 py-md-5">
    <h1 class="mb-3 mb-md-4 text-center text-md-start">Polityka Prywatności</h1>

    <div class="card shadow-lg">
      <div class="card-body p-3 p-md-4">
        <h2 class="h4 mb-2 mb-md-3">1. Informacje ogólne</h2>
        <p class="text-justify">
          Niniejsza polityka dotyczy Serwisu Internetowego GameZone (zwany dalej
          "Serwisem"). Administratorem danych jest zespół GameZone z siedzibą w
          Warszawie.
        </p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">2. Gromadzenie danych</h2>
        <p class="text-justify">
          Zbieramy wyłącznie dane niezbędne do funkcjonowania Serwisu. W
          przypadku rejestracji użytkowników, przechowujemy podstawowe
          informacje kontaktowe.
        </p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">3. Pliki cookies</h2>
        <p class="text-justify">
          Serwis wykorzystuje pliki cookies w celu zapewnienia prawidłowego
          działania podstawowych funkcji. Nie śledzimy użytkowników w celach
          marketingowych.
        </p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">4. Bezpieczeństwo</h2>
        <p class="text-justify">
          Stosujemy standardowe środki bezpieczeństwa SSL oraz regularne
          aktualizacje systemu w celu ochrony danych użytkowników.
        </p>

        <h2 class="h4 mb-2 mb-md-3 mt-3 mt-md-4">5. Zmiany w polityce</h2>
        <p class="text-justify">
          Zastrzegamy sobie prawo do aktualizacji polityki. Wszelkie zmiany będą
          publikowane w tej sekcji.
        </p>

        <div class="mt-3 mt-md-4 p-2 p-md-3 bg-light rounded">
          <p class="mb-0 small">
            Ostatnia aktualizacja: 1 stycznia 2024<br />
            Kontakt: gamezone@gmail.com
          </p>
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
</style>
