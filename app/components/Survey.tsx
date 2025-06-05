"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import SurveyQuestionView from "./SurveyQuestionView";
import SurveyCompletionView from "./SurveyCompletionView";
import NoApplicableQuestionsView from "./NoApplicableQuestionsView";
import { UserAnswer, AllSurveyResponsesMap } from "../lib/survey.types";
import {
  questionsData,
  ANIMATION_IN_CLASS,
  ANIMATION_OUT_CLASS,
  ANIMATION_DURATION,
  uiStrings,
} from "../lib/survey.config";
import {
  getTranslatedText,
  isQuestionDisplayable,
  findNextDisplayableQuestionIndex,
  generateNewSessionId,
} from "../lib/survey.utils";

export default function SurveyComponent() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "th">("th"); // Default server-renderable value
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("surveyLanguage", currentLanguage);
    }
  }, [currentLanguage]);

  const [currentSessionId, setCurrentSessionId] = useState<string>(() =>
    generateNewSessionId()
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start directly with the first question
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]); // Current session's answers

  const [allSurveyResponses, setAllSurveyResponses] =
    useState<AllSurveyResponsesMap>({}); // Default server-renderable value
  const [areResponsesInitialized, setAreResponsesInitialized] = useState(false);

  const [lastCompletedSessionAnswers, setLastCompletedSessionAnswers] =
    useState<UserAnswer[] | null>(null);
  const animatedBoxRef = useRef<HTMLDivElement>(null); // Renamed and will be moved to the outer box
  const currentAnimationClassRef = useRef<string | null>(null); // Tracks the currently applied animation class (IN or OUT)
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Initialize currentLanguage from localStorage on client-side
    const savedLang = localStorage.getItem("surveyLanguage");
    if (savedLang === "en" || savedLang === "th") {
      setCurrentLanguage(savedLang);
    }
    setIsLanguageInitialized(true);

    // Initialize allSurveyResponses from localStorage on client-side
    const savedResponses = localStorage.getItem("allSurveyResponses");
    if (savedResponses) {
      try {
        let dataToProcess = JSON.parse(savedResponses);
        let migratedData: AllSurveyResponsesMap | null = null;

        // Migration from old array format to new map format
        if (Array.isArray(dataToProcess)) {
          console.warn(
            "Old localStorage format (UserAnswer[]) detected for allSurveyResponses. Migrating to new map format."
          );
          migratedData = {};
          (dataToProcess as UserAnswer[]).forEach((answer) => {
            if (typeof answer.sessionId === "string") {
              if (!migratedData![answer.sessionId]) {
                migratedData![answer.sessionId] = [];
              }
              if (
                typeof answer.questionId === "number" &&
                Array.isArray(answer.selectedOptionIds)
              ) {
                migratedData![answer.sessionId].push(answer);
              }
            }
          });
          dataToProcess = migratedData;
        }

        if (
          typeof dataToProcess === "object" &&
          dataToProcess !== null &&
          !Array.isArray(dataToProcess)
        ) {
          const isValidMap = Object.values(dataToProcess).every(
            (sessionAnswers) =>
              Array.isArray(sessionAnswers) &&
              sessionAnswers.every(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ans: any): ans is UserAnswer =>
                  typeof ans.sessionId === "string" &&
                  typeof ans.timestamp === "number" &&
                  typeof ans.questionId === "number" &&
                  typeof ans.questionTextInSessionLanguage === "string" &&
                  typeof ans.selectedAnswerInSessionLanguage === "string" &&
                  Array.isArray(ans.selectedOptionIds) &&
                  ans.selectedOptionIds.every(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (id: any) => typeof id === "string"
                  ) &&
                  (ans.languageOfSubmission === "en" ||
                    ans.languageOfSubmission === "th")
              )
          );
          if (isValidMap) {
            setAllSurveyResponses(dataToProcess as AllSurveyResponsesMap);
          }
        }
      } catch (error) {
        console.error(
          "Error parsing survey responses from localStorage:",
          error
        );
        localStorage.removeItem("allSurveyResponses"); // Clear corrupted data
      }
    }
    setAreResponsesInitialized(true);
  }, []);

  // Initialize totalSessionsCompleted based on loaded allSurveyResponses
  const totalMainQuestions = useMemo(
    () => questionsData.filter((q) => !q.required_id).length,
    [] // questionsData is static, so this runs once
  );

  const answeredMainQuestions = useMemo(() => {
    return userAnswers.filter((ua) => {
      const questionConfig = questionsData.find((q) => q.id === ua.questionId);
      return questionConfig && !questionConfig.required_id;
    }).length;
  }, [userAnswers]);
  // Effect to handle question skipping and survey completion due to skipping
  useEffect(() => {
    // Skip this effect if not in active questioning phase or on initial welcome screen
    if (
      showCompletionScreen || // viewingSpecificAnswersSet removed as it's no longer used meaningfully
      currentQuestionIndex === -1
    ) {
      return;
    }

    if (currentQuestionIndex >= questionsData.length) {
      // Attempted to go beyond the last question, means survey is finished.
      if (userAnswers.length > 0 && !showCompletionScreen) {
        // currentSessionId here is the ID of the session that just completed.
        setAllSurveyResponses((prevMap) => {
          const newMap = { ...prevMap, [currentSessionId]: userAnswers };
          return newMap;
        });
        setLastCompletedSessionAnswers(userAnswers);
        // userAnswers will be cleared on explicit restart
        setCurrentSessionId(generateNewSessionId()); // Generate a new ID for the *next* potential session
        setShowCompletionScreen(true); // This state change triggers the completion screen render
      }
      // If userAnswers.length is 0, it means all questions were skipped from the start, or survey was empty.
      // The UI will handle showing "No Applicable Questions" if currentQuestion becomes null.
      return;
    }

    const questionToDisplay = questionsData[currentQuestionIndex];
    if (
      questionToDisplay &&
      !isQuestionDisplayable(questionToDisplay, userAnswers)
    ) {
      // This question is not displayable, try the next one.
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // This will re-trigger the effect.
    }
    // If it IS displayable, the effect does nothing, and currentQuestion will be derived correctly.
  }, [currentQuestionIndex, userAnswers, showCompletionScreen, currentSessionId]);

  const currentQuestion =
    currentQuestionIndex >= 0 &&
    currentQuestionIndex < questionsData.length &&
    isQuestionDisplayable(questionsData[currentQuestionIndex], userAnswers) // Check displayability
      ? questionsData[currentQuestionIndex]
      : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "allSurveyResponses",
        JSON.stringify(allSurveyResponses)
      );
    }
  }, [allSurveyResponses]);

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return; // optionId is the unique ID of the option

    if (currentQuestion.type === "single-choice") {
      setSelectedOptionIds([optionId]);
    } else {
      // multiple-choice
      setSelectedOptionIds((prevSelected) =>
        prevSelected.includes(optionId)
          ? prevSelected.filter((item) => item !== optionId)
          : [...prevSelected, optionId]
      );
    }
  };

  const handleNextQuestion = async () => {
    if (isTransitioning) return; // Prevent multiple clicks during animation
    if (selectedOptionIds.length === 0) {
      alert(getTranslatedText(uiStrings.alertOptionNeeded, currentLanguage));
      return;
    }

    if (!currentQuestion) {
      console.error(
        "handleNextQuestion called but currentQuestion is null. This should not happen.",
        currentLanguage
      );
      return;
    }
    setIsTransitioning(true);

    // Outro Animation for the current question
    const element = animatedBoxRef.current;
    if (element) {
      element.classList.remove(ANIMATION_IN_CLASS); // Remove current intro animation
      element.classList.add(ANIMATION_OUT_CLASS);
      currentAnimationClassRef.current = ANIMATION_OUT_CLASS;
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION));
    }

    const currentQuestionText = getTranslatedText(
      currentQuestion.text,
      currentLanguage
    );
    const selectedAnswersTexts = selectedOptionIds
      .map((optionId) => {
        const option = currentQuestion.options.find(
          (opt) => opt.id === optionId
        );
        return option ? getTranslatedText(option.text, currentLanguage) : "";
      })
      .filter((text) => text !== "");

    const newAnswer: UserAnswer = {
      sessionId: currentSessionId, // currentSessionId is guaranteed non-null here because we only show questions if it's set
      questionId: currentQuestion.id, // currentQuestion is guaranteed non-null here
      questionTextInSessionLanguage: currentQuestionText,
      selectedAnswerInSessionLanguage: selectedAnswersTexts.join(", "), // Store the text representation
      selectedOptionIds: [...selectedOptionIds],
      languageOfSubmission: currentLanguage,
      timestamp: Date.now(),
    };
    if (!currentSessionId) {
      console.error(
        "Critical: currentSessionId is null when creating an answer. This should not happen."
      );
      // Potentially generate a fallback session ID or handle error
    }

    const updatedCurrentSessionAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedCurrentSessionAnswers);
    setSelectedOptionIds([]);

    // Attempt to move to the next logical question index.
    // The useEffect will handle skipping or survey completion if this index is invalid or out of bounds.
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    setIsTransitioning(false);
  };

  const restartSurvey = () => {
    setUserAnswers([]); // Clear answers first, so isQuestionDisplayable works correctly for restart
    setCurrentQuestionIndex(0); // Attempt to go to the first question. useEffect will skip if needed.
    setShowCompletionScreen(false); // Hide the completion screen
    setLastCompletedSessionAnswers(null);
    setCurrentSessionId(generateNewSessionId());
    // allSurveyResponses persists across restarts within the same session
  };

  useEffect(() => {
    const element = animatedBoxRef.current; // Use the ref for the whole box
    if (!element) return;

    // Always remove both potential animation classes before applying a new one or none.
    element.classList.remove(ANIMATION_IN_CLASS, ANIMATION_OUT_CLASS);
    // If currentAnimationClassRef held something else (e.g. an old random class name), clear it too.
    if (
      currentAnimationClassRef.current &&
      currentAnimationClassRef.current !== ANIMATION_IN_CLASS &&
      currentAnimationClassRef.current !== ANIMATION_OUT_CLASS
    ) {
      element.classList.remove(currentAnimationClassRef.current);
    }
    if (
      showCompletionScreen ||
      !currentQuestion // Don't animate if there's no current question (e.g., during skipping or on completion)
    ) {
      currentAnimationClassRef.current = null; // No active question animation
      return;
    }
    // Apply IN animation for the new question
    element.classList.add(ANIMATION_IN_CLASS);
    currentAnimationClassRef.current = ANIMATION_IN_CLASS;
    // We want the element to stay in its "slid-up" state, so no animationend listener to remove the class.
  }, [showCompletionScreen, currentQuestion]); // viewingSpecificAnswersSet removed

  // Prevent rendering until client-side state is initialized to avoid hydration mismatch
  if (!isLanguageInitialized || !areResponsesInitialized) {
    return null; // Or a loading spinner, but null is safest for hydration
  }

  if (showCompletionScreen) {
    return (
      <SurveyCompletionView
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        lastCompletedSessionAnswers={lastCompletedSessionAnswers}
        restartSurvey={restartSurvey}
      />
    );
  }

  // If not on a special screen, and currentQuestion is null, it means no questions are applicable.
  // (and currentQuestionIndex is not -1, because that's the welcome screen)
  if (
    !currentQuestion &&
    currentQuestionIndex !== -1 &&
    !showCompletionScreen // viewingSpecificAnswersSet removed
  ) {
    return (
      <NoApplicableQuestionsView
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        restartSurvey={restartSurvey}
      />
    );
  }

  return (
    <div
      ref={animatedBoxRef}
      className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md"
    >
      <SurveyQuestionView
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        currentQuestion={currentQuestion}
        selectedOptionIds={selectedOptionIds}
        handleOptionSelect={handleOptionSelect}
        handleNextQuestion={handleNextQuestion}
        isTransitioning={isTransitioning}
        totalMainQuestions={totalMainQuestions}
        answeredMainQuestions={answeredMainQuestions}
        findNextDisplayableQuestionIndex={findNextDisplayableQuestionIndex}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        isOptional={!!currentQuestion?.required_id}
      />
    </div>
  );
}
