const { Handle500Error, Handle400Error, Handle200Response } = require("../helpers");
const { Quiz } = require("../models");
const { Insert, Find } = require("./baseController");

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
                where: { user: user?._id },
            })

            Handle200Response(res, { message: 'Quiz fetched successfully.', data: quizzes });
        } catch (error) {
            Handle500Error(error, req, res, next);
        }
    }

}