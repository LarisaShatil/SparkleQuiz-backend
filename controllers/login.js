const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  console.log('BODY:', req)
  const { email, password } = req.body

  const user = await User.findOne({ email })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid email or password'
    })
  }

  // token logic
  const userForTocken = {
    email: user.email,
    id: user._id,
  }

  // expires in 1 hour
  const token = jwt.sign(
    userForTocken,
    process.env.SECRET,
    { expiresIn: 60 * 60 })

  res
    .status(200)
    .send({ token, email: user.email, name: user.name, id: user.id })

})

module.exports = loginRouter