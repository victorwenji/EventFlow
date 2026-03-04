const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// POST /api/auth/register
exports.register = async (req, res) => {
try {
const { name, email, password, role } = req.body

console.log('Register body reçu :', req.body)

const existingUser = await User.findOne({ email })
if (existingUser) {
  return res.status(400).json({ message: 'Email déjà utilisé' })
}

    // // Hash du mot de passe ici
    // const salt = await bcrypt.genSalt(12)
    // const hashedPassword = await bcrypt.hash(password, salt)

    // const user = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role
    // })

  //v1
  const token = generateToken(user._id)

  res.status(201).json({
    message: 'Compte créé avec succès',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
} catch (err) {
  console.error(' Erreur register :', err)
  res.status(500).json({ message: err.message })
}
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user })
}