const express = require('express');
const { Auth } = require('../../controllers');

const router = express.Router();

router.post('/login', Auth.loginUser);
router.post('/sign-up', Auth.registerUser);
router.post('/add-quiz', Auth.CreateQuiz);
router.post('/add-question', Auth.CreateQuestion);

router.get('/quiz/:QuizId', Auth.getQuizByQuizId);
router.get('/question/:QuestionId', Auth.getQuestionByQuestionId);
router.get('/question/:QuestionId', Auth.getQuestionByQuestionId);
router.post('/storage', Auth.CreateStorage);


module.exports = router;

