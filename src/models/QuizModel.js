const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    quiz_name: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true, ref:'users'}

},{
    timestamps: true,
})

const QuizModel = mongoose.model('quizs', QuizSchema);
module.exports = QuizModel;