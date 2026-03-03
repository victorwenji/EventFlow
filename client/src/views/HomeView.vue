<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section text-white text-center py-5">
      <div class="container py-5">
        <h1 class="display-4 fw-bold mb-3">
           Bienvenue sur <span class="text-primary">EventFlow</span>
        </h1>
        <p class="lead mb-4 text-light">
          La plateforme professionnelle pour gérer vos conférences, séminaires et meetups.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <RouterLink to="/register" class="btn btn-primary btn-lg px-5">
            Commencer gratuitement
          </RouterLink>
          <RouterLink to="/login" class="btn btn-outline-light btn-lg px-5">
            Se connecter
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5 bg-white">
      <div class="container">
        <h2 class="text-center fw-bold mb-5">Pourquoi EventFlow ?</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="feature in features" :key="feature.title">
            <div class="card border-0 shadow-sm h-100 text-center p-4">
              <div class="fs-1 mb-3">{{ feature.icon }}</div>
              <h5 class="fw-bold">{{ feature.title }}</h5>
              <p class="text-muted">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  {
    icon: '',
    title: 'Gestion simplifiée',
    description: 'Créez et gérez vos événements en quelques clics avec une interface intuitive.'
  },
  {
    icon: '',
    title: 'Sécurisé & Fiable',
    description: 'Authentification JWT, rôles et permissions pour une sécurité maximale.'
  },
  {
    icon: '',
    title: 'Suivi en temps réel',
    description: 'Suivez les inscriptions et les places disponibles en temps réel.'
  }
]
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}
</style>