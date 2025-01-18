const { Handle500Error, Handle400Error, Handle200Response } = require("../helpers");
const { Quiz, Question, QuizAttempt } = require("../models");
const { Insert, Find, FindOne, ObjectId, FindAndUpdate } = require("./baseController");
const mongoose = require('mongoose')
module.exports = {
    CreateQuiz: async (req, res, next) => {
        try {
            const user = req?.user
            const { quizName = "" } = req.body
            if (!quizName) {
                return Handle400Error(res, 'Please provide a valid quiz name.');
            }
            const insertQuiz = await Insert({
                model: Quiz,
                data: {
                    quiz_name: quizName,
                    user: user?._id,
                },
            });
            if (!insertQuiz)
                return Handle400Error(res, 'Failed to create quiz.');
            Handle200Response(res, { message: 'Quiz created successfully.', data: insertQuiz });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    GetAllQuiz: async (req, res, next) => {
        try {
            const user = req.user
            const quizzes = await Find({
                model: Quiz,
                where: {
                    user: user?._id,
                    status: { $ne: 'deleted' }
                },
                sort: {
                    createdAt: -1,
                }
            })

            Handle200Response(res, { message: 'Quiz fetched successfully.', data: quizzes });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    getQuizByQuizId: async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) return Handle400Error(res, "Please Send Quiz Id.")
            const quiz = await FindOne({
                model: Quiz,
                where: { _id: id },
            })
            if (!quiz) return Handle400Error(res, "Please enter a valid Quiz id ")
            return Handle200Response(res, {
                message: 'Quiz fetched successfully.',
                data: quiz

            })
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    CreateQuestion: async (req, res, next) => {
        try {
            const user = req.user
            const { questionName, a, b, c, d, correctAns, quizId } = req.body;

            if (!questionName || !a || !b || !c || !d || !correctAns || !quizId) {
                return Handle400Error(res, 'All fields are required');
            }

            if (!mongoose.Types.ObjectId.isValid(quizId))
                return Handle400Error(res, 'Please Enter A Valid Quiz ID');


            const isQuizIdExist = await FindOne({
                model: Quiz,
                where: { _id: ObjectId(quizId) },
            });
            if (!isQuizIdExist) {
                return Handle400Error(res, 'Invalid Quiz id :');
            }

            const insertQuestion = await Insert({
                model: Question,
                data: {
                    question_name: questionName,
                    option_a: a,
                    option_b: b,
                    option_c: c,
                    option_d: d,
                    correct_answer: correctAns,
                    user: user?._id,
                    quizid: quizId,
                },
            });
            if (!insertQuestion) {
                return Handle400Error(res, 'Failed to insert !');
            }
            return Handle200Response(res, insertQuestion);
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    getQuestionByQuiz: async (req, res, next) => {
        try {
            const { quizId = null } = req.params
            if (!quizId) {
                return Handle400Error(res, 'Please provide quiz id.');
            }
            const questions = await Find({
                model: Question,
                where: { quizid: quizId, status: { $ne: 'deleted' } },
            });

            Handle200Response(res, { message: 'Questions fetched successfully.', data: questions });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    GetQuizInfoAndQuestionByQuizId: async (req, res, next) => {
        try {
            const { quizId = null } = req.params
            if (!quizId) {
                return Handle400Error(res, 'Please provide quiz id.');
            }
            const quiz = await FindOne({
                model: Quiz,
                where: { _id: ObjectId(quizId) },
            });
            if (!quiz) {
                return Handle400Error(res, 'Invalid Quiz id.');
            }
            const questions = await Find({
                model: Question,
                where: { quizid: quizId, status: { $ne: 'deleted' } },
                select: "question_name option_a option_b option_c option_d"
            });
            quiz.questions = questions
            Handle200Response(res, { message: 'Quiz fetched successfully.', data: quiz });
        }
        catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    SubmitQuizAndGetScore: async (req, res, next) => {
        try {
            const { quizId } = req.params;
            const { answers, userDetails } = req.body;

            // Validate request data
            if (!quizId) {
                return Handle400Error(res, 'Please provide quiz id.');
            }

            if (!answers || !Array.isArray(answers)) {
                return Handle400Error(res, 'Please provide answers array.');
            }

            if (!userDetails) {
                return Handle400Error(res, 'Please provide user details.');
            }

            // Get quiz from database
            const quiz = await FindOne({
                model: Quiz,
                where: { _id: ObjectId(quizId) },
            });

            if (!quiz) {
                return Handle400Error(res, 'Invalid Quiz id.');
            }

            // Get questions with correct answers
            const questions = await Find({
                model: Question,
                where: { quizid: quizId },
                select: "question_name option_a option_b option_c option_d correct_answer"
            });

            // Calculate score
            let correctAnswers = 0;
            const questionResults = [];

            answers.forEach(answer => {
                const question = questions.find(q => q._id.toString() === answer.questionId);

                if (question) {
                    const isCorrect = question.correct_answer.toLowerCase() == answer?.selectedAnswer?.toLowerCase();
                    if (isCorrect) correctAnswers++;

                    questionResults.push({
                        questionId: answer.questionId,
                        userAnswer: answer.selectedAnswer,
                        correctAnswer: question.correct_answer,
                        isCorrect,
                        questionName: question.question_name
                    });
                }
            });

            const totalQuestions = questions.length;
            const score = (correctAnswers / totalQuestions) * 100;

            // Create quiz attempt record
            const quizAttempt = await Insert({
                model: QuizAttempt,
                data: {
                    quizId,
                    quizName: quiz.quiz_name,
                    userDetails,
                    answers: questionResults,
                    score,
                    totalQuestions,
                    correctAnswers,
                    attemptedAt: new Date(),
                }
            });

            // Prepare response
            const result = {
                score,
                totalQuestions,
                correctAnswers,
                userDetails,
                questionResults,
                attemptId: quizAttempt._id
            };

            Handle200Response(res, {
                message: 'Quiz submitted successfully.',
                data: result
            });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    DeleteQuiz: async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) return Handle400Error(res, "Please Send Quiz Id.")
            const quiz = await FindOne({
                model: Quiz,
                where: { _id: ObjectId(id) },
            });
            if (!quiz) return Handle400Error(res, "Please enter a valid Quiz id ")

            const deleteQuiz = await FindAndUpdate({
                model: Quiz,
                where: { _id: id },
                update: {
                    $set: { status: 'deleted' },
                }
            });
            if (!deleteQuiz)
                return Handle400Error(res, 'Failed to delete quiz!')
            return Handle200Response(res, { message: 'Quiz deleted successfully.' });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    },
    DeleteQuestion: async (req, res, next) => {
        try {
            const { id } = req.params
            if (!id) return Handle400Error(res, "Please Send Question Id.")
            const question = await FindOne({
                model: Question,
                where: { _id: ObjectId(id) },
            });
            if (!question) return Handle400Error(res, "Please enter a valid Question id ")
            const deleteQuestion = await FindAndUpdate({
                model: Question,
                where: { _id: id },
                update: {
                    $set: { status: 'deleted' },
                }
            });
            if (!deleteQuestion)
                return Handle400Error(res, 'Failed to delete question!')
            return Handle200Response(res, { message: 'Question deleted successfully.' });

        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    }


}