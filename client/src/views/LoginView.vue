<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
    <div class="card border-0 shadow-lg p-4" style="width: 100%; max-width: 420px;">

      <div class="text-center mb-4">
        <h2 class="fw-bold">⚡ EventFlow</h2>
        <p class="text-muted">Connectez-vous à votre compte</p>
      </div>

      <div class="alert alert-danger" v-if="error">{{ error }}</div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Email *</label>
        <input
          v-model="form.email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          placeholder="votre@email.com"
        />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Mot de passe *</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          placeholder="••••••••"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <button
        class="btn btn-primary w-100 py-2 fw-semibold"
        @click="handleLogin"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <hr class="my-4" />

      <p class="text-center text-muted mb-0">
        Pas encore de compte ?
        <RouterLink to="/register" class="text-primary fw-semibold">S'inscrire</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toastification'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({ email: '', password: '' })
const errors = ref({})
const error = ref('')
const loading = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.email) errors.value.email = 'Email requis'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Email invalide'
  if (!form.value.password) errors.value.password = 'Mot de passe requis'
  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', form.value)
    authStore.setAuth(res.data.user, res.data.token)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
}
</style>