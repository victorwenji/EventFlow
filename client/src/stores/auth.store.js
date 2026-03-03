import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOrganisateur = computed(() => user.value?.role === 'organisateur')
  const isParticipant = computed(() => user.value?.role === 'participant')

  function setAuth(userData, tokenData) {
    user.value = userData
    token.value = tokenData
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user, token,
    isAuthenticated, isAdmin, isOrganisateur, isParticipant,
    setAuth, logout
  }
})