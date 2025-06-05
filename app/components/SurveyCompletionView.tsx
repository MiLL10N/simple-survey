import React from "react";
import { UserAnswer, Question as FullQuestionType } from "../lib/survey.types";
import { questionsData, uiStrings } from "../lib/survey.config";
import { getTranslatedText } from "../lib/survey.utils";

interface SurveyCompletionViewProps {
  currentLanguage: "en" | "th";
  setCurrentLanguage: (lang: "en" | "th") => void;
  lastCompletedSessionAnswers: UserAnswer[] | null;
  restartSurvey: () => void;
}

const SurveyCompletionView: React.FC<SurveyCompletionViewProps> = ({
  currentLanguage,
  setCurrentLanguage,
  lastCompletedSessionAnswers,
  restartSurvey,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md text-center">
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
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        {getTranslatedText(uiStrings.surveyCompletedTitle, currentLanguage)}
      </h2>
      <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
        {getTranslatedText(uiStrings.thankYouMessage, currentLanguage)}
      </p>
      {lastCompletedSessionAnswers &&
        lastCompletedSessionAnswers.length > 0 && (
          <div className="my-6 text-left">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              {getTranslatedText(uiStrings.yourAnswersTitle, currentLanguage)}
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              {lastCompletedSessionAnswers.map((answer, index) => (
                <div
                  key={`${answer.questionId}-${index}-completed`}
                  className="p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                >
                  {((): React.ReactNode => {
                    const originalQuestion = questionsData.find(
                      (q: FullQuestionType) => q.id === answer.questionId
                    );
                    if (!originalQuestion) {
                      return (
                        <p className="text-red-500">
                          Question data not found.
                        </p>
                      );
                    }

                    const questionText = getTranslatedText(
                      originalQuestion.text,
                      currentLanguage
                    );
                    const selectedOptionsTexts = answer.selectedOptionIds
                      .map((optId) => {
                        const optionData = originalQuestion.options.find(
                          (o) => o.id === optId
                        );
                        return optionData
                          ? getTranslatedText(
                              optionData.text,
                              currentLanguage
                            )
                          : `[Option ID: ${optId}]`;
                      })
                      .join(", ");
                    return (
                      <>
                        <p className="font-medium text-sm text-gray-700 dark:text-gray-200">
                          {questionText}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {getTranslatedText(
                            uiStrings.answerLabel,
                            currentLanguage
                          )}{" "}
                          {selectedOptionsTexts || "N/A"}
                        </p>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
        <button
          onClick={restartSurvey}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-150 ease-in-out"
        >
          {getTranslatedText(uiStrings.restartSurveyButton, currentLanguage)}
        </button>
      </div>
    </div>
  );
};
export default SurveyCompletionView;