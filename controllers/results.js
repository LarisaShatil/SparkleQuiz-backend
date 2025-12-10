const resultsRouter = require('express').Router()
const Result = require('../models/result')
const User = require('../models/user')

resultsRouter.get('/', async (req, res) => {
  const results = await Result.find({}).populate('userId', { name: 1 })
  res.json(results)
})

resultsRouter.get('/user/:id', async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.id })
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

resultsRouter.post('/', async (req, res) => {
  const { userId, quizCategory, score, total } = req.body
  const user = await User.findById(userId)

  if (!user) {
    return res
      .status(400)
      .json({
        error: 'userId missing or not valid'
      })
  } else if (!userId || !quizCategory || score===null || !total) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  try {
    const createdOrUpdated = await Result.findOneAndUpdate(
      { userId, quizCategory },
      { score, total },
      { new: true, upsert: true }
    )
    res.status(201).json(createdOrUpdated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = resultsRouter
