const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question_name: {type: String, required: true},
    option_a: {type: String, required: true},
    option_b: {type: String, required: true},
    option_c: {type: String, required: false},
    option_d: {type: String, required: false},
    correct_answer: {type: String, required: true,enum:['a','b','c','d']},
    user: {type: Schema.Types.ObjectId, ref:'users', required:true},
    quizid:{type:Schema.Types.ObjectId, ref:'quizs', required:true},
},{
    timestamps:true,
})                                                                                                      

const QuestionModel = mongoose.model('question', QuestionSchema);
module.exports = QuestionModel;