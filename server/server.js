const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gentle-peace-production.up.railway.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'))
app.use('/api/events', require('./src/routes/event.routes'))

// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: ' EventFlow API is running !' })
})

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connecté')
    app.listen(process.env.PORT || 5000, () => {
      console.log(` Serveur lancé sur le port ${process.env.PORT}`)
    })
  })
  .catch(err => {
    console.error(' Erreur MongoDB :', err.message)
    process.exit(1)
  })