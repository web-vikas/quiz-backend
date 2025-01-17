const express = require('express');
const { Quiz } = require('../../controllers');

const router = express.Router();

router.post('/', Quiz.CreateQuiz);
router.get('/', Quiz.GetAllQuiz);

module.exports = router;