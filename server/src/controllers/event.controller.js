const Event = require('../models/Event.model')

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ date: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('registrations', 'name email role')
    if (!event) return res.status(404).json({ message: 'Événement introuvable' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id
    })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Événement introuvable' })

    // Vérif propriétaire ou admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Événement introuvable' })

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: ' Événement supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/events/:id/register
exports.registerToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Événement introuvable' })

    // Déjà inscrit ?
    if (event.registrations.includes(req.user._id)) {
      return res.status(400).json({ message: 'Déjà inscrit à cet événement' })
    }

    // Places disponibles ?
    if (event.registrations.length >= event.capacity) {
      return res.status(400).json({ message: 'Événement complet' })
    }

    event.registrations.push(req.user._id)
    await event.save()

    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}