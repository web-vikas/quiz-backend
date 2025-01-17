const express = require('express');
const { Quiz } = require('../../controllers');

const router = express.Router();

router.post('/', Quiz.CreateQuiz);
router.get('/', Quiz.GetAllQuiz);
router.get('/:id', Quiz.getQuizByQuizId);
router.post('/question', Quiz.CreateQuestion);
router.get('/questions/:quizId', Quiz.getQuestionByQuiz);

module.exports = router;