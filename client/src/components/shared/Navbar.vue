<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
    <RouterLink class="navbar-brand fw-bold text-primary" to="/">
       EventFlow
    </RouterLink>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navMenu"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto align-items-center gap-2">

        <li class="nav-item" v-if="!authStore.isAuthenticated">
          <RouterLink class="nav-link" to="/login">Connexion</RouterLink>
        </li>

        <li class="nav-item" v-if="!authStore.isAuthenticated">
          <RouterLink class="btn btn-primary btn-sm" to="/register">
            S'inscrire
          </RouterLink>
        </li>

        <li class="nav-item" v-if="authStore.isAuthenticated">
          <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
        </li>

        <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
          
            class="nav-link dropdown-toggle text-white"
            href="#"
            data-bs-toggle="dropdown"
          >
           <a>  {{ authStore.user?.name }}
            <span class="badge bg-primary ms-1">{{ authStore.user?.role }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
            <li>
              <button class="dropdown-item text-danger" @click="handleLogout">
                 Déconnexion
              </button>
            </li>
          </ul>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>