<template>
  <div class="container py-5">

    <!-- Loading -->
    <div class="text-center py-5" v-if="loading">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Contenu -->
    <div v-else-if="event" class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-lg p-4">

          <!-- Header -->
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 class="fw-bold">{{ event.title }}</h2>
              <span
                class="badge fs-6"
                :class="placesRestantes > 0 ? 'bg-success' : 'bg-danger'"
              >
                {{ placesRestantes > 0 ? `${placesRestantes} places restantes` : 'Complet' }}
              </span>
            </div>
            <RouterLink to="/dashboard" class="btn btn-outline-secondary btn-sm">
              ← Retour
            </RouterLink>
          </div>

          <!-- Infos -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="p-3 bg-light rounded">
                <p class="text-muted small mb-1"> Date</p>
                <p class="fw-semibold mb-0">{{ formatDate(event.date) }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded">
                <p class="text-muted small mb-1"> Lieu</p>
                <p class="fw-semibold mb-0">{{ event.location }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded">
                <p class="text-muted small mb-1"> Inscriptions</p>
                <p class="fw-semibold mb-0">
                  {{ event.registrations?.length || 0 }} / {{ event.capacity }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded">
                <p class="text-muted small mb-1"> Organisateur</p>
                <p class="fw-semibold mb-0">{{ event.organizer?.name || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h5 class="fw-bold">Description</h5>
            <p class="text-muted">{{ event.description }}</p>
          </div>

          <!-- Action inscription -->
          <div v-if="authStore.isParticipant">
            <button
              class="btn btn-primary btn-lg w-100"
              :disabled="placesRestantes === 0 || dejaInscrit"
              @click="handleInscrire"
            >
              {{ dejaInscrit ? ' Vous êtes inscrit' : "S'inscrire à cet événement" }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Liste des inscrits (admin + organisateur uniquement) -->
    <div
      v-if="event && (authStore.isAdmin || authStore.isOrganisateur)"
      class="mt-4"
    >
      <h5 class="fw-bold mb-3">
       Participants inscrits
        <span class="badge bg-primary ms-2">{{ event.registrations?.length || 0 }}</span>
      </h5>

      <!-- Aucun inscrit -->
      <div
        v-if="!event.registrations || event.registrations.length === 0"
        class="text-center py-3 bg-light rounded"
      >
        <p class="text-muted mb-0">Aucun participant inscrit pour le moment</p>
      </div>

      <!-- Table inscrits -->
      <div class="table-responsive" v-else>
        <table class="table table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(participant, index) in event.registrations"
              :key="participant._id"
            >
              <td class="text-muted">{{ index + 1 }}</td>
              <td>
                <span class="fw-semibold">{{ participant.name }}</span>
              </td>
              <td class="text-muted">{{ participant.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Erreur -->
    <div class="text-center py-5" v-else>
      <p class="text-muted">Événement introuvable.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useEventsStore } from '../stores/events.store'
import api from '../services/api'

const route = useRoute()
const authStore = useAuthStore()
const eventsStore = useEventsStore()

const event = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get(`/events/${route.params.id}`)
    event.value = res.data
  } catch (err) {
    console.error('Erreur chargement événement', err)
  } finally {
    loading.value = false
  }
})

const placesRestantes = computed(() =>
  (event.value?.capacity || 0) - (event.value?.registrations?.length || 0)
)

const dejaInscrit = computed(() =>
  event.value?.registrations?.includes(authStore.user?._id)
)

async function handleInscrire() {
  try {
    const res = await api.post(`/events/${event.value._id}/register`)
    event.value = res.data
    eventsStore.updateEvent(res.data)
  } catch (err) {
    console.error('Erreur inscription', err)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>