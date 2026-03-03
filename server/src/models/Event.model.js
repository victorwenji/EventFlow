const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    minlength: 10
  },
  date: {
    type: Date,
    required: [true, 'La date est requise']
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: 1
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)