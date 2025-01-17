const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizAttemptSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'quizs',
        required: true
    },
    userDetails: {
        name: String,
        class: String,
        schoolName: String
    },
    answers: [{
        questionId: Schema.Types.ObjectId,
        questionName: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    attemptedAt: {
        type: Date,
        default: Date.now
    }
});

const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);
module.exports = QuizAttempt;
