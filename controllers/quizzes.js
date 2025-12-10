const quizzesRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Quiz = require('../models/quiz')
const User = require('../models/user')


quizzesRouter.get('/', async (req, res) => {
  const quizes = await Quiz.find()
  res.json(quizes)
})

quizzesRouter.get('/:id', async (req, res) => {
  const question = await Quiz.findById(req.params.id)

  if (question) {
    res.json(question)
  } else {
    res.status(404).end()
  }
})

quizzesRouter.delete('/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return res
      .status(404)
      .json({
        error: 'Quiz is not found'
      })
  }

  await Quiz.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

quizzesRouter.post('/', middleware.tokenExtractor, async (req, res) => {
  const { question, correct_answer, answers, category } = req.body

  const user = await User.findById(req.user.id)

  if (!user) {
    return res
      .status(400)
      .json({
        error: 'userId missing or not valid'
      })
  } else if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Admins only.'
    })
  }
  else if (!question || !correct_answer || !answers || !category) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const newQuestion = new Quiz(req.body)
  const savedQuestion = await newQuestion.save()

  res.status(201).json(savedQuestion)
})


quizzesRouter.put('/:id', async (req, res) => {
  const { question, correct_answer, answers, category } = req.body

  const updatedQuestion = await Quiz.findByIdAndUpdate(req.params.id,
    { question, correct_answer, answers, category },
    { new: true, runValidators: true, context: 'query' })

  if (updatedQuestion) {
    res.json(updatedQuestion)
  } else {
    res.status(404).end()
  }
})


module.exports = quizzesRouter