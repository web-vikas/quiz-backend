const mongoose = require('mongoose');

exports.User = require('./UserModel');
exports.OTP = require('./OTPModel');
exports.Question = require('./QuestionModel');
exports.Quiz = require('./QuizModel');

exports.Mongoose = mongoose;
