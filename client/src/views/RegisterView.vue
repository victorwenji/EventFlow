<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
    <div class="card border-0 shadow-lg p-4" style="width: 100%; max-width: 480px;">

      <div class="text-center mb-4">
        <h2 class="fw-bold">⚡ EventFlow</h2>
        <p class="text-muted">Créez votre compte</p>
      </div>

      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <div class="alert alert-success" v-if="success">{{ success }}</div>

      <!-- Nom -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nom complet *</label>
        <input
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          placeholder="Jean Dupont"
        />
        <div class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <!-- Email -->
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

      <!-- Rôle -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Rôle *</label>
        <select
          v-model="form.role"
          class="form-select"
          :class="{ 'is-invalid': errors.role }"
        >
          <option value="">-- Choisir un rôle --</option>
          <option value="participant">Participant</option>
          <option value="organisateur">Organisateur</option>
        </select>
        <div class="invalid-feedback">{{ errors.role }}</div>
      </div>

      <!-- Mot de passe -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Mot de passe *</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          placeholder="Min. 6 caractères"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <!-- Confirmation -->
      <div class="mb-4">
        <label class="form-label fw-semibold">Confirmer le mot de passe *</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmPassword }"
          placeholder="••••••••"
        />
        <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
      </div>

      <button
        class="btn btn-primary w-100 py-2 fw-semibold"
        @click="handleRegister"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? 'Création...' : 'Créer mon compte' }}
      </button>

      <hr class="my-4" />

      <p class="text-center text-muted mb-0">
        Déjà un compte ?
        <RouterLink to="/login" class="text-primary fw-semibold">Se connecter</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({ name: '', email: '', role: '', password: '', confirmPassword: '' })
const errors = ref({})
const error = ref('')
const success = ref('')
const loading = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.name?.trim()) errors.value.name = 'Nom requis'
  if (!form.value.email) errors.value.email = 'Email requis'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Email invalide'
  if (!form.value.role) errors.value.role = 'Rôle requis'
  if (!form.value.password) errors.value.password = 'Mot de passe requis'
  else if (form.value.password.length < 6) errors.value.password = 'Min. 6 caractères'
  if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas'
  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/register', {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      password: form.value.password
    })
    success.value = '✅ Compte créé ! Redirection...'
    setTimeout(() => router.push({ name: 'Login' }), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
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