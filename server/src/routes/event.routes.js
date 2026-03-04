const router = require('express').Router()
const eventController = require('../controllers/event.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

// Debug temporaire


router.get('/', authMiddleware, eventController.getEvents)
router.get('/:id', authMiddleware, eventController.getEvent)
router.post('/', authMiddleware, roleMiddleware('organisateur', 'admin'), eventController.createEvent)
router.put('/:id', authMiddleware, roleMiddleware('organisateur', 'admin'), eventController.updateEvent)
router.delete('/:id', authMiddleware, roleMiddleware('organisateur', 'admin'), eventController.deleteEvent)
router.post('/:id/register', authMiddleware, roleMiddleware('participant'), eventController.registerToEvent)

module.exports = router