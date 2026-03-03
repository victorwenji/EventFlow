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
        <li>📅 {{ formatDate(event.date) }}</li>
        <li>📍 {{ event.location }}</li>
        <li>👥 {{ event.registrations?.length || 0 }} / {{ event.capacity }} inscrits</li>
      </ul>

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
          {{ dejaInscrit ? '✅ Inscrit' : "S'inscrire" }}
        </button>

        <!-- Actions organisateur/admin -->
        <template v-if="authStore.isAdmin || isOwner">
          <button
            class="btn btn-outline-warning btn-sm"
            @click="$emit('modifier', event)"
          >✏️</button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="$emit('supprimer', event._id)"
          >🗑️</button>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth.store'

const props = defineProps({
  event: { type: Object, required: true }
})

defineEmits(['inscrire', 'modifier', 'supprimer'])

const authStore = useAuthStore()

const placesRestantes = computed(() =>
  props.event.capacity - (props.event.registrations?.length || 0)
)

const dejaInscrit = computed(() =>
  props.event.registrations?.includes(authStore.user?._id)
)

const isOwner = computed(() =>
  props.event.organizer === authStore.user?._id
)

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