const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {
  Handle500Error,
  Handle200Response,
  Handle400Error,
} = require('../helpers');
const {env} = require('../config');
const {
  ValidateMobile,
  ValidateEmail,
  FindOne,
  Insert,
  ObjectId,
} = require('./baseController');
const {User, Quiz, Question} = require('../models');
// const {response} = require('../config/express');

module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const {email, password, mobile, name, gender} = req.body;
      if (!email || !password || !mobile || !name || !gender) {
        return Handle400Error(res, 'Please provide all required user details');
      }

      if (!ValidateEmail(email))
        return Handle400Error(res, 'Please enter a valid email');
      if (!ValidateMobile(mobile))
        return Handle400Error(res, 'Please enter a valid phone number');
      const userExists = await FindOne({
        model: User,
        where: {email: email},
      });
      if (userExists) return Handle400Error(res, 'Email already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Insert({
        model: User,
        data: {email, password: hashedPassword, mobile, name, gender},
      });
      if (!newUser) {
        return Handle400Error(res, 'Failed to register please try again');
      }
      return Handle200Response(res, {
        message: 'User registered successfully',
        data: newUser,
      });
    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        return Handle400Error(res, 'Please provide email and password');
      }
      const user = await FindOne({
        model: User,
        where: {email: email},
      });
      if (!user) {
        return Handle400Error(res, 'Invalid email or password');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return Handle400Error(res, 'Invalid email or password');
      }
      const token = jwt.sign({id: user._id}, env.secret, {
        expiresIn: env.token_expiry_limit,
      });
      return Handle200Response(res, {
        message: 'User logged in successfully',
        data: {...user, token},
      });
    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  },

  CreateQuiz: async (req, res, next) => {
    try {
      const {quizname, userid} = req.body;

      if (!quizname) {
        return Handle400Error(res, 'Quiz name bhej do');
      }
      if (!userid) {
        return Handle400Error(res, 'user id bhej');
      }
      // console.log(quizname);
      if (!mongoose.Types.ObjectId.isValid(userid))
        return Handle400Error(res, 'valid user id bhej');

      const isUserExist = await FindOne({
        model: User,
        where: {_id: ObjectId(userid)},
      });
      if (!isUserExist) {
        return Handle400Error(res, 'invalid user id :');
      }
      // --------------------------set-----------------------------
      const insertQuiz = await Insert({
        model: Quiz,
        data: {
          quiz_name: quizname,
          user: userid,
        },
      });
      // -------------------------------------****-------------------------------
      if (!insertQuiz) {
        return Handle400Error(res, 'save hone m dikkt hui');
      }
      return Handle200Response(res, insertQuiz);
    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  },
  getQuizByQuizId: async (req, res, next) => {
    try {
      const {QuizId} = req.params;
      if (!QuizId) {
        return Handle400Error(res, 'Quiz id bhej do');
      }
      if (!mongoose.Types.ObjectId.isValid(QuizId))
        return Handle400Error(res, 'valid user id bhej');
      const quiz = await FindOne({
        model: Quiz,
        where: {_id: ObjectId(QuizId)},
      });
      return Handle200Response(res, quiz);
    } catch (error) {
      return Handle500Error(error, req, res, next);
    }
  },

  CreateQuestion: async (req, res, next) => {
    try {
      const {questinname, a, b, c, d, correctans, quizid, user} = req.body;

      if (!questinname) {
        // console.log(questinname, 'success');
        return Handle400Error(res, 'Question name bhejo');
      }
      if (!a) {
        return Handle400Error(res, 'Option A bhejo');
      }
      if (!b) {
        return Handle400Error(res, 'Option b bhejo');
      }
      if (!c) {
        return Handle400Error(res, 'Option c bhejo');
      }
      if (!d) {
        return Handle400Error(res, 'Option d bhejo');
      }
      if (!correctans) {
        return Handle400Error(res, 'Correct answer bhejo');
      }

      if (!user) {
        return Handle400Error(res, 'send me user name');
      }
      if (!mongoose.Types.ObjectId.isValid(user))
        return Handle400Error(res, 'valid user name bhej');

      if (!quizid) {
        return Handle400Error(res, 'send me quizid ');
      }
      if (!mongoose.Types.ObjectId.isValid(quizid))
        return Handle400Error(res, 'valid Quiz id bhej');

      const isUserExist = await FindOne({
        model: User,
        where: {_id: ObjectId(user)},
      });
      if (!isUserExist) {
        return Handle400Error(res, 'Invalid user id :');
      }
      const isQuizIdExist = await FindOne({
        model: Quiz,
        where: {_id: ObjectId(quizid)},
      });
      if (!isQuizIdExist) {
        return Handle400Error(res, 'Invalid Quiz id :');
      }
      // --------------------------------------set----------------------------------
      const insertQuestion = await Insert({
        model: Question,
        data: {
          question_name: questinname,
          option_a: a,
          option_b: b,
          option_c: c,
          option_d: d,
          correct_answer: correctans,
          user: user,
          quizid: quizid,
        },
      });
      // --------------------------------------set----------------------------------
      if (!insertQuestion) {
        return Handle400Error(res, 'Question save hone m dikkt hui');
      }
      return Handle200Response(res, insertQuestion);
    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  },
  getQuestionByQuestionId: async (req, res, next) => {
    try {
      const {QuestionId} = req.params;
      if (!QuestionId) {
        return Handle400Error(res, 'Question id bhej do');
      }
      if (!mongoose.Types.ObjectId.isValid(QuestionId))
        return Handle400Error(res, 'valid Question id bhej');

      const question = await FindOne({
        model: Question,
        where: {_id: ObjectId(QuestionId)},
      });
      return Handle200Response(res, question);
    } catch (error) {
      return Handle500Error(error, req, res, next);
    }
  }
};
