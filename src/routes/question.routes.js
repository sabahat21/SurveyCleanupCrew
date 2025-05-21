import { Router } from "express";
import {
  addQuestions,
  getQuestion,
} from "../controllers/question.controller.js";
import { checkApiKey } from "../middlewares/apiKey.js";

// Initiate Router
const questionRouter = Router();

// [ POST ] METHOD to add questions to DB alongside API-KEY check middleware
questionRouter.route("/surveyQuestions").post(checkApiKey, addQuestions);

// [ GET ] METHOD to retrieve all the questions follows pagination
questionRouter.route("/").get(checkApiKey, getQuestion);

export default questionRouter;
