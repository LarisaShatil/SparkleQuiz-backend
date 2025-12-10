const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const uknkownEndpoint = (req, res) => {
  res.status(404)
    .send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }

  next()
}

const userExtractor = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    req.user = decodedToken
    next()
  } catch (err) {
    console.log(err)
    return res.status(401)
      .json({
        error: 'token invalid'
      })
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400)
      .send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400)
      .json({ error: err.message })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400)
      .json({ error: 'expected `email` to be unique' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(err)
}

module.exports = {
  requestLogger,
  uknkownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler
}