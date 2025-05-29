import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// User adds answers to the questions [ PUT ]
const addAnswerToQuestion = asyncHandler(async (req, res) => {
  // get response from FrontEnd
  const { questions, answers } = req.body;

  // checking for empty validation
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "Question must not be an empty Array");
  }

  //Updating the QuestionScehma with Answer of that QuestionID -- linking answer to question and incrementing the answer count if its the same answer

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const a = answers[i];

    // Step 1: is question ID missing?
    if (!q._id || q._id.trim() === "") {
      throw new ApiError(400, "Missing question ID");
    }

    // Step 2 If the user skipped this question (empty answer)
    if (!a || !a.answer || a.answer.trim() === "") {
      await Question.findByIdAndUpdate(q._id, { $inc: { timesSkipped: 1 } });
      continue; // Skip to next question
    }

    // Step 3 Normalize answer
    const cleanAnswer = a.answer.toLowerCase().trim();

    // Step 4 Find the existing question document
    const questionDoc = await Question.findById(q._id);
    if (!questionDoc) {
      throw new ApiError(404, `Question with ID ${q._id} not found`);
    }

    // Step 5 Check if this answer already exists in DB
    const existing = questionDoc.answers.find(
      (ans) => ans.answer === cleanAnswer
    );

    if (existing) {
      // Step 6 Increment responseCount for that answer
      await Question.findByIdAndUpdate(
        q._id,
        { $inc: { "answers.$[elem].responseCount": 1 } },
        { arrayFilters: [{ "elem.answer": cleanAnswer }] }
      );
    } else {
      // Step 7 Add new answer with responseCount 1
      await Question.findByIdAndUpdate(q._id, {
        $push: {
          answers: {
            answer: cleanAnswer,
            responseCount: 1,
          },
        },
      });
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Question Updated with Answers"));
});

// ADMIN deletes the Answers by this method
const deleteAnswerByID = asyncHandler(async (req, res) => {
  if (!req.isAdminRoute) {
    return res
      .status(404)
      .json(new ApiError(404, "Invalid Request. NO ADMIN privilege "));
  }
  const { questionID, answerID } = req.body;

  const question = await Question.findByIdAndUpdate(
    questionID,
    { $pull: { answers: { _id: answerID } } },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, question));
});

export { addAnswerToQuestion, deleteAnswerByID };
