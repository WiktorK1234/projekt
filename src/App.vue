<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold">projekt</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-3" active-class="active"
                >Home</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 py-4">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="bg-dark text-white py-4 mt-auto">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="fw-bold">O nas</h5>
            <p class="mb-0">
              Krótki opis projektu lub firmy. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Linki</h5>
            <ul class="list-unstyled">
              <li>
                <router-link to="/" class="text-white text-decoration-none"
                  >Home</router-link
                >
              </li>
              <li>
                <a href="#" class="text-white text-decoration-none"
                  >Polityka prywatności</a
                >
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Kontakt</h5>
            <ul class="list-unstyled">
              <li><i class="bi bi-envelope me-2"></i> email@example.com</li>
              <li><i class="bi bi-phone me-2"></i> +48 123 456 789</li>
            </ul>
          </div>
        </div>
        <hr class="my-4 bg-light" />
        <div class="text-center">
          <p class="mb-0">&copy; 2023 Projekt. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
