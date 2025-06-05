import { Question, UserAnswer, TranslatedText } from "../lib/survey.types";
import { questionsData } from "./survey.config";

export const getTranslatedText = (
  textObj: TranslatedText | undefined,
  lang: "en" | "th"
): string => {
  if (!textObj) return "";
  return textObj[lang] || textObj.en;
};

export const isQuestionDisplayable = (
  question: Question,
  answers: UserAnswer[]
): boolean => {
  if (
    question.required_id != null &&
    question.required_id_answer_option_id != null
  ) {
    const dependentAnswer = answers.find(
      (ans) => ans.questionId === question.required_id
    );
    if (
      !dependentAnswer ||
      !dependentAnswer.selectedOptionIds.includes(
        question.required_id_answer_option_id
      )
    ) {
      return false;
    }
  }
  return true;
};

export const findNextDisplayableQuestionIndex = (
  startIndex: number,
  answers: UserAnswer[]
): number => {
  for (let i = startIndex; i < questionsData.length; i++) {
    if (isQuestionDisplayable(questionsData[i], answers)) {
      return i;
    }
  }
  return -1;
};

export const generateNewSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};