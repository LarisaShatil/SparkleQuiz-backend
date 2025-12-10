const mongoose = require('mongoose')

const quizSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
    minlength: 15
  },
  correct_answer: {
    type: String,
    required: true
  },
  answers: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 4
      },
      message: 'Answers must contain 4 items'
    }
  },
  category: {
    type: String,
    enum: ['general', 'celebrities', 'animals', 'history', 'Finland'],
    default: 'general'
  }
})

quizSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Quiz', quizSchema)