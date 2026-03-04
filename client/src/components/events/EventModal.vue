<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="show" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">

        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title fw-bold">
            {{ isEditing ? ' Modifier l\'événement' : ' Créer un événement' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>

        <div class="modal-body p-4">
          <div class="row g-3">

            <!-- Titre -->
            <div class="col-12">
              <label class="form-label fw-semibold">Titre *</label>
              <input
                v-model="form.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.title }"
                placeholder="Nom de l'événement"
              />
              <div class="invalid-feedback">{{ errors.title }}</div>
            </div>

            <!-- Description -->
            <div class="col-12">
              <label class="form-label fw-semibold">Description *</label>
              <textarea
                v-model="form.description"
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
                rows="3"
                placeholder="Décrivez votre événement..."
              ></textarea>
              <div class="invalid-feedback">{{ errors.description }}</div>
            </div>

            <!-- Date + Lieu -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Date *</label>
              <input
                v-model="form.date"
                type="datetime-local"
                class="form-control"
                :class="{ 'is-invalid': errors.date }"
              />
              <div class="invalid-feedback">{{ errors.date }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Lieu *</label>
              <input
                v-model="form.location"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.location }"
                placeholder="Paris, Lyon..."
              />
              <div class="invalid-feedback">{{ errors.location }}</div>
            </div>

            <!-- Capacité -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Nombre de places *</label>
              <input
                v-model.number="form.capacity"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': errors.capacity }"
                min="1"
                placeholder="50"
              />
              <div class="invalid-feedback">{{ errors.capacity }}</div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Annuler</button>
          <button class="btn btn-primary px-4" @click="handleSubmit">
            {{ isEditing ? 'Mettre à jour' : 'Créer l\'événement' }}
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div class="modal-backdrop fade show" v-if="show"></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
//import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  eventData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const isEditing = computed(() => !!props.eventData)

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: ''
})

const errors = ref({})

// Pré-remplir si édition
watch(() => props.eventData, (val) => {
  if (val) {
    form.value = {
      title: val.title,
      description: val.description,
      date: val.date?.slice(0, 16),
      location: val.location,
      capacity: val.capacity
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function validate() {
  errors.value = {}
  if (!form.value.title?.trim()) errors.value.title = 'Le titre est requis'
  if (!form.value.description?.trim()) errors.value.description = 'La description est requise'
  if (!form.value.date) errors.value.date = 'La date est requise'
  if (!form.value.location?.trim()) errors.value.location = 'Le lieu est requis'
  if (!form.value.capacity || form.value.capacity < 1) errors.value.capacity = 'Capacité invalide'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validate()) emit('submit', { ...form.value })
}

function resetForm() {
  form.value = { title: '', description: '', date: '', location: '', capacity: '' }
  errors.value = {}
}
</script>