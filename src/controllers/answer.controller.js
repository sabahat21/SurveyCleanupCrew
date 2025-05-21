import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// TO-DO finish the linking of answer to the question Right now it's not working.

const addAnswerToQuestion = asyncHandler(async (req, res) => {
  const response = req.body;

  res.status(200).json(new ApiResponse(200, "Success !!"), response);
});

export { addAnswerToQuestion };
