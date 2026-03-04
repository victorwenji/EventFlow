<template>
  <div class="card h-100 shadow-sm border-0 event-card">
    <div class="card-body d-flex flex-column">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title fw-bold mb-0">{{ event.title }}</h5>
        <span
          class="badge"
          :class="placesRestantes > 0 ? 'bg-success' : 'bg-danger'"
        >
          {{ placesRestantes > 0 ? `${placesRestantes} places` : 'Complet' }}
        </span>
      </div>

      <!-- Description -->
      <p class="card-text text-muted small flex-grow-1">
        {{ event.description?.slice(0, 120) }}...
      </p>

      <!-- Infos -->
      <ul class="list-unstyled small text-muted mt-2">
        <li> {{ formatDate(event.date) }}</li>
        <li> {{ event.location }}</li>
        <li> {{ event.registrations?.length || 0 }} / {{ event.capacity }} inscrits</li>
      </ul>

      <!-- Compte à rebours -->
      <div class="mt-2 p-2 rounded text-center"
        :class="countdownClass"
      >
        <small class="fw-semibold">{{ countdownText }}</small>
      </div>


      <!-- Actions -->
      <div class="d-flex gap-2 mt-3">
        <RouterLink
          :to="`/events/${event._id}`"
          class="btn btn-outline-primary btn-sm flex-grow-1"
        >
          Voir détails
        </RouterLink>

        <!-- Bouton inscription participant -->
        <button
          v-if="authStore.isParticipant"
          class="btn btn-primary btn-sm flex-grow-1"
          :disabled="placesRestantes === 0 || dejaInscrit"
          @click="$emit('inscrire', event._id)"
        >
          {{ dejaInscrit ? ' Inscrit' : "S'inscrire" }}
        </button>

        <!-- Actions organisateur/admin -->
        <template v-if="authStore.isAdmin || isOwner">
          <button
            class="btn btn-outline-warning btn-sm"
            @click="$emit('modifier', event)"
          >Edit</button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="$emit('supprimer', event._id)"
          >Delet</button>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth.store'

const props = defineProps({
  event: { type: Object, required: true }
})

defineEmits(['inscrire', 'modifier', 'supprimer'])

const authStore = useAuthStore()

const now = ref(Date.now())
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const placesRestantes = computed(() =>
  props.event.capacity - (props.event.registrations?.length || 0)
)

const dejaInscrit = computed(() =>
  props.event.registrations?.includes(authStore.user?._id)
)

const isOwner = computed(() =>
  props.event.organizer === authStore.user?._id
)

const countdown = computed(() => {
  const diff = new Date(props.event.date) - now.value
  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
})

const countdownText = computed(() => {
  if (!countdown.value) return ' Événement terminé'
  const { days, hours, minutes, seconds } = countdown.value
  if (days > 0) return ` Dans ${days}j ${hours}h ${minutes}m`
  if (hours > 0) return ` Dans ${hours}h ${minutes}m ${seconds}s`
  return ` Dans ${minutes}m ${seconds}s`
})

const countdownClass = computed(() => {
  if (!countdown.value) return 'bg-secondary bg-opacity-10 text-secondary'
  const { days, hours } = countdown.value
  if (days >= 1) return 'bg-success bg-opacity-10 text-success'
  if (hours >= 1) return 'bg-warning bg-opacity-10 text-warning'
  return 'bg-danger bg-opacity-10 text-danger'
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}
</script>

<style scoped>
.event-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px !important;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
</style>