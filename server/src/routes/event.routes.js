const router = require('express').Router()
const {
  getEvents, getEvent, createEvent,
  updateEvent, deleteEvent, registerToEvent
} = require('../controllers/event.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', authMiddleware, getEvents)
router.get('/:id', authMiddleware, getEvent)
router.post('/', authMiddleware, roleMiddleware('organisateur', 'admin'), createEvent)
router.put('/:id', authMiddleware, roleMiddleware('organisateur', 'admin'), updateEvent)
router.delete('/:id', authMiddleware, roleMiddleware('organisateur', 'admin'), deleteEvent)
router.post('/:id/register', authMiddleware, roleMiddleware('participant'), registerToEvent)

module.exports = router