const mongoose = require('mongoose');

const AnsweredQuestionSchema = mongoose.Schema({
  title: { type: String, required: true},
  correct: {type: String, required: true},
  answer2: {type: String},
  answer3: {type: String},
  answer4: {type: String},
  studentID: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('AnsweredQuestions',AnsweredQuestionSchema);
