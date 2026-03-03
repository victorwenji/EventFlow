import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const filterDate = ref('')

  // Filtre dynamique
  const filteredEvents = computed(() => {
    return events.value.filter(event => {
      const matchSearch = event.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
      const matchDate = filterDate.value
        ? event.date.startsWith(filterDate.value)
        : true
      return matchSearch && matchDate
    })
  })

  function setEvents(data) {
    events.value = data
  }

  function addEvent(event) {
    events.value.push(event)
  }

  function updateEvent(updated) {
    const index = events.value.findIndex(e => e._id === updated._id)
    if (index !== -1) events.value[index] = updated
  }

  function removeEvent(id) {
    events.value = events.value.filter(e => e._id !== id)
  }

  return {
    events, loading, searchQuery, filterDate,
    filteredEvents, setEvents, addEvent, updateEvent, removeEvent
  }
})