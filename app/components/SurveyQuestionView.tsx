import React from "react";
import { Question, UserAnswer } from "../lib/survey.types";
import { uiStrings } from "../lib/survey.config";
import { getTranslatedText } from "../lib/survey.utils";

interface SurveyQuestionViewProps {
  currentLanguage: "en" | "th";
  setCurrentLanguage: (lang: "en" | "th") => void;
  currentQuestion: Question | null;
  selectedOptionIds: string[];
  handleOptionSelect: (optionId: string) => void;
  handleNextQuestion: () => Promise<void>;
  isTransitioning: boolean;
  totalMainQuestions: number;
  answeredMainQuestions: number;
  findNextDisplayableQuestionIndex: (
    startIndex: number,
    answers: UserAnswer[]
  ) => number;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isOptional?: boolean;
}

const SurveyQuestionView: React.FC<SurveyQuestionViewProps> = ({
  currentLanguage,
  setCurrentLanguage,
  currentQuestion,
  selectedOptionIds,
  handleOptionSelect,
  handleNextQuestion,
  isTransitioning,
  totalMainQuestions,
  answeredMainQuestions,
  findNextDisplayableQuestionIndex,
  currentQuestionIndex,
  userAnswers,
  isOptional,
}) => {
  return (
    <>
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setCurrentLanguage("en")}
          disabled={currentLanguage === "en"}
          className={`px-3 py-1 text-sm rounded ${
            currentLanguage === "en"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setCurrentLanguage("th")}
          disabled={currentLanguage === "th"}
          className={`px-3 py-1 text-sm rounded ${
            currentLanguage === "th"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          TH
        </button>
      </div>
      <div>
        {totalMainQuestions > 0 && currentQuestion && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-right">
              {isOptional
                ? getTranslatedText(
                    uiStrings.optionalQuestionProgressLabel,
                    currentLanguage
                  )
                : getTranslatedText(uiStrings.progressText, currentLanguage)
                    .replace("{answered}", answeredMainQuestions.toString())
                    .replace("{total}", totalMainQuestions.toString())}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`${
                  isOptional ? "bg-teal-500" : "bg-blue-500" // Changed color for optional
                } h-2.5 rounded-full transition-all duration-300 ease-out`}
                style={{
                  width: `${
                    (answeredMainQuestions / totalMainQuestions) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 flex items-center">
            {currentQuestion
              ? getTranslatedText(currentQuestion.text, currentLanguage)
              : ""}
          </p>
          {isOptional && currentQuestion && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getTranslatedText(uiStrings.optionalIndicator, currentLanguage)}
            </span>
          )}
        </div>
        <div className="space-y-3 mb-8">
          {currentQuestion?.options.map((optionObj) => (
            <label
              key={optionObj.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out
                          ${
                            selectedOptionIds.includes(optionObj.id)
                              ? "bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
            >
              <input
                type={
                  currentQuestion?.type === "multiple-choice"
                    ? "checkbox"
                    : "radio"
                }
                name={`question-${currentQuestion?.id}`}
                value={optionObj.id}
                checked={selectedOptionIds.includes(optionObj.id)}
                onChange={() => handleOptionSelect(optionObj.id)}
                className={`h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-300 border-gray-300 dark:border-gray-500 ${
                  currentQuestion?.type === "multiple-choice"
                    ? "form-checkbox"
                    : "form-radio"
                }`}
              />
              <span className="ml-3 text-sm sm:text-md text-gray-700 dark:text-gray-200">
                {getTranslatedText(optionObj.text, currentLanguage)}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={
            selectedOptionIds.length === 0 ||
            !currentQuestion ||
            isTransitioning
          }
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-150 ease-in-out
                    ${
                      selectedOptionIds.length === 0 || !currentQuestion
                        ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
                        : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                    }`}
        >
          {findNextDisplayableQuestionIndex(
            currentQuestionIndex + 1,
            userAnswers
          ) === -1
            ? getTranslatedText(uiStrings.finishSurveyButton, currentLanguage)
            : getTranslatedText(uiStrings.nextButton, currentLanguage)}
        </button>
      </div>
    </>
  );
};
export default SurveyQuestionView;
