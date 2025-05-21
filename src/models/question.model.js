import mongoose, { Schema } from "mongoose";
import { QUESTION_TYPE } from "../constants.js";

const answerSchema = new Schema({
  answer: { type: String, required: false, trim: true },
  score: { type: Number, required: false, min: 0 },
  rank: { type: Number, required: false, min: 1 },
  isRevealed: { type: Boolean, default: false },
});

const questionSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    questionType: {
      type: String,
      enum: Object.values(QUESTION_TYPE),
      required: false,
    },
    answers: [answerSchema], // Embedded answers
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
