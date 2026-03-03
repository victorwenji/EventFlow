<template>
  <div class="container py-5">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">🎯 Dashboard</h2>
        <p class="text-muted mb-0">Bienvenue, <strong>{{ authStore.user?.name }}</strong>
          <span class="badge bg-primary ms-2">{{ authStore.user?.role }}</span>
        </p>
      </div>
      <button
        v-if="authStore.isOrganisateur || authStore.isAdmin"
        class="btn btn-primary px-4"
        @click="openCreateModal"
      >
        ➕ Créer un événement
      </button>
    </div>

    <!-- Filtres -->
    <div class="card border-0 shadow-sm p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-6">
          <input
            v-model="eventsStore.searchQuery"
            type="text"
            class="form-control"
            placeholder="🔍 Rechercher un événement..."
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="eventsStore.filterDate"
            type="date"
            class="form-control"
          />
        </div>
        <div class="col-md-2">
          <button class="btn btn-outline-secondary w-100" @click="resetFilters">
            🔄 Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div class="text-center py-5" v-if="eventsStore.loading">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Chargement des événements...</p>
    </div>

    <!-- Aucun résultat -->
    <div class="text-center py-5" v-else-if="eventsStore.filteredEvents.length === 0">
      <p class="fs-1">📭</p>
      <p class="text-muted">Aucun événement trouvé</p>
    </div>

    <!-- Grille événements -->
    <div class="row g-4" v-else>
      <div
        class="col-md-6 col-lg-4"
        v-for="event in eventsStore.filteredEvents"
        :key="event._id"
      >
        <EventCard
          :event="event"
          @inscrire="handleInscrire"
          @modifier="openEditModal"
          @supprimer="handleSupprimer"
        />
      </div>
    </div>

  </div>

  <!-- Modal Création/Édition -->
  <EventModal
    :show="showModal"
    :eventData="selectedEvent"
    @close="closeModal"
    @submit="handleSubmitEvent"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useEventsStore } from '../stores/events.store'
import EventCard from '../components/events/EventCard.vue'
import EventModal from '../components/events/EventModal.vue'
import api from '../services/api'

const authStore = useAuthStore()
const eventsStore = useEventsStore()

const showModal = ref(false)
const selectedEvent = ref(null)

// Chargement des événements
onMounted(async () => {
  eventsStore.loading = true
  try {
    const res = await api.get('/events')
    eventsStore.setEvents(res.data)
  } catch (err) {
    console.error('Erreur chargement événements', err)
  } finally {
    eventsStore.loading = false
  }
})

// Filtres
function resetFilters() {
  eventsStore.searchQuery = ''
  eventsStore.filterDate = ''
}

// Modal
function openCreateModal() {
  selectedEvent.value = null
  showModal.value = true
}

function openEditModal(event) {
  selectedEvent.value = event
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedEvent.value = null
}

// CRUD
async function handleSubmitEvent(formData) {
  try {
    if (selectedEvent.value) {
      const res = await api.put(`/events/${selectedEvent.value._id}`, formData)
      eventsStore.updateEvent(res.data)
    } else {
      const res = await api.post('/events', formData)
      eventsStore.addEvent(res.data)
    }
    closeModal()
  } catch (err) {
    console.error('Erreur sauvegarde événement', err)
  }
}

async function handleSupprimer(id) {
  if (!confirm('Supprimer cet événement ?')) return
  try {
    await api.delete(`/events/${id}`)
    eventsStore.removeEvent(id)
  } catch (err) {
    console.error('Erreur suppression', err)
  }
}

async function handleInscrire(id) {
  try {
    const res = await api.post(`/events/${id}/register`)
    eventsStore.updateEvent(res.data)
  } catch (err) {
    console.error('Erreur inscription', err)
  }
}
</script>