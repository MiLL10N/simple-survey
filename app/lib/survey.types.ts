export interface TranslatedText {
  en: string;
  th: string;
}

export interface QuestionOption {
  id: string;
  text: TranslatedText;
}

export interface Question {
  id: number;
  text: TranslatedText;
  options: Array<QuestionOption>;
  type: "single-choice" | "multiple-choice";
  required_id?: number | null;
  required_id_answer_option_id?: string | null;
}

export interface UserAnswer {
  sessionId: string;
  questionId: number;
  questionTextInSessionLanguage: string;
  selectedAnswerInSessionLanguage: string;
  selectedOptionIds: string[];
  languageOfSubmission: "en" | "th";
  timestamp: number;
}

export type AllSurveyResponsesMap = Record<string, UserAnswer[]>;