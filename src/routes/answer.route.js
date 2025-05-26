import { Router } from "express";
import { addAnswerToQuestion, deleteAnswerByID } from "../controllers/answer.controller.js";
import { checkApiKey } from "../middlewares/apiKey.js";

// initiate the router
const answerRouter = Router();

// default route adding answers to the questions with API-KEY middleware check
answerRouter.route("/").put(checkApiKey, addAnswerToQuestion);

// route for deleting an answer by id
answerRouter.route("/").delete(checkApiKey, addAnswerToQuestion);

export default answerRouter;
