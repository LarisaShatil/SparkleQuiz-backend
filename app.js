const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const quizzesRouter = require('./controllers/quizzes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const resultsRouter = require('./controllers/results')

const app = express()
app.use(express.json())
app.use(cors())
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/quizzes', quizzesRouter)
app.use('/api/users', usersRouter)
app.use('/api/results', resultsRouter)


logger.info('connecting to --->', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('===> connected to MongoDB')
  })
  .catch((err) => {
    logger.error('!!! error connection to MongoDB: ', err.message)
  })

app.use(middleware.requestLogger)
app.use(middleware.uknkownEndpoint)
app.use(middleware.errorHandler)


module.exports = app