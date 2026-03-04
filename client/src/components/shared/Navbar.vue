<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
    <RouterLink class="navbar-brand fw-bold text-primary" to="/">
       EventFlow
    </RouterLink>

    <button
      class="navbar-toggler"
      type="button"
      @click="toggleMenu"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" :class="{ show: menuOpen }">
      <ul class="navbar-nav ms-auto align-items-center gap-2">

        <!-- Non connecté -->
        <template v-if="!authStore.isAuthenticated">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Connexion</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="btn btn-primary btn-sm" to="/register">
              S'inscrire
            </RouterLink>
          </li>
        </template>

        <!-- Connecté -->
        <template v-if="authStore.isAuthenticated">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
          </li>

          <li class="nav-item">
            <span class="nav-link text-white">
               {{ authStore.user?.name }}
              <!-- <span class="badge bg-primary ms-1">{{ authStore.user?.role }}</span> -->
            </span>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-danger btn-sm"
              @click="handleLogout"
            >
               Déconnexion
            </button>
          </li>
        </template>

      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>