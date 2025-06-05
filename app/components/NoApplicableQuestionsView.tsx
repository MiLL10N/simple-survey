import React from "react";
import { uiStrings } from "../lib/survey.config";
import { getTranslatedText } from "../lib/survey.utils";

interface NoApplicableQuestionsViewProps {
  currentLanguage: "en" | "th";
  setCurrentLanguage: (lang: "en" | "th") => void;
  restartSurvey: () => void;
}

const NoApplicableQuestionsView: React.FC<NoApplicableQuestionsViewProps> = ({
  currentLanguage,
  setCurrentLanguage,
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
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {getTranslatedText(
          uiStrings.noApplicableQuestionsTitle,
          currentLanguage
        )}
      </h2>
      <p className="text-md mb-6 text-gray-700 dark:text-gray-300">
        {getTranslatedText(
          uiStrings.noApplicableQuestionsMessage,
          currentLanguage
        )}
      </p>
      <button
        onClick={restartSurvey}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
      >
        {getTranslatedText(uiStrings.backToStartButton, currentLanguage)}
      </button>
    </div>
  );
};
export default NoApplicableQuestionsView;