<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold">
          <i class="bi bi-controller me-2"></i>GameZone
        </router-link>
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
              <router-link to="/" class="nav-link px-3" active-class="active">
                <i class="bi bi-house-door me-1"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/gallery"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-images me-1"></i>Galeria
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/formularz"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-archive-fill me-1"></i>Formularz
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/recenzje"
                class="nav-link px-3"
                active-class="active"
              >
                <i class="bi bi-list-ul me-1"></i>Recenzje
              </router-link>
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
            <h5 class="fw-bold">Chcesz wiedzieć więcej?</h5>
            <p class="mb-0">
              Napisz do nas, zadzwoń lub śledź nas w mediach społecznościowych,
              gdzie publikujemy najnowsze informacje związane z grami oraz ich
              przecenami.
            </p>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Linki</h5>
            <ul class="list-unstyled">
              <li class="btn-group-vertical">
                <button class="btn btn-outline-primary mb-2">
                  <i class="bi bi-facebook me-2"></i> Facebook
                </button>
                <button class="btn btn-outline-warning mb-2">
                  <i class="bi bi-instagram me-2"></i> Instagram
                </button>
                <router-link to="#" class="btn btn-outline-danger"
                  >Polityka prywatności</router-link
                >
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="fw-bold">Kontakt</h5>
            <ul class="list-unstyled">
              <li><i class="bi bi-envelope me-2"></i> GameZone@gmail.com</li>
              <li><i class="bi bi-phone me-2"></i> +48 123 456 789</li>
            </ul>
          </div>
        </div>
        <hr class="my-4 bg-light" />
        <div class="text-center">
          <p class="mb-0">&copy; 2023 GameZone. Wszelkie prawa zastrzeżone.</p>
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
