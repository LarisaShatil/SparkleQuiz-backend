const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { name, email, role, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    email,
    role,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ error: 'User is not found' })
  }

  await User.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = usersRouter