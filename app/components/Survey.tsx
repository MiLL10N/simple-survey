"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface TranslatedText {
  en: string;
  th: string;
}

interface Question {
  id: number;
  text: TranslatedText;
  options: Array<{ id: string; text: TranslatedText }>;
  type: "single-choice" | "multiple-choice"; // Determines if single or multiple options can be selected
  required_id?: number | null; // For questions that are related to previous ones
  required_id_answer_option_id?: string | null; // The ID of the option from the dependent question that enables this question
}

interface UserAnswer {
  sessionId: string; // Identifier for the survey session
  questionId: number;
  questionTextInSessionLanguage: string; // Text of the question in the language it was answered
  selectedAnswerInSessionLanguage: string; // Concatenated text of selected option(s) in the language it was answered
  selectedOptionIds: string[]; // Array of IDs of the selected option(s)
  languageOfSubmission: "en" | "th";
  timestamp: number; // Timestamp (e.g., Date.now()) when this answer was recorded
}

const questionsData: Question[] = [
  {
    id: 1,
    text: {
      th: "ตำแหน่งงานของคุณในองค์กรคืออะไร?",
      en: "What is your job position in the organization?",
    },
    options: [
      {
        id: "q1_opt1",
        text: { th: "HR Manager / Director", en: "HR Manager / Director" },
      },
      {
        id: "q1_opt2",
        text: { th: "HR Staff / Specialist", en: "HR Staff / Specialist" },
      },
      {
        id: "q1_opt3",
        text: {
          th: "Business Owner / Executive",
          en: "Business Owner / Executive",
        },
      },
      { id: "q1_opt4", text: { th: "Tech/ IT", en: "Tech/ IT" } },
    ],
    type: "single-choice",
  },
  {
    id: 2,
    text: {
      th: "ขณะนี้องค์กรของคุณกำลังเผชิญกับความท้าทายด้าน HR เรื่องใดมากที่สุด?",
      en: "What is the biggest HR challenge your organization is currently facing?",
    },
    options: [
      {
        id: "q2_opt1",
        text: {
          th: "การสร้างความผูกพันและรักษาพนักงาน",
          en: "Building employee engagement and retention",
        },
      },
      {
        id: "q2_opt2",
        text: {
          th: "ขาดระบบ HR ดิจิทัลแบบครบวงจร",
          en: "Lack of a comprehensive digital HR system",
        },
      },
      {
        id: "q2_opt3",
        text: {
          th: "การติดตามเป้าหมายและประเมินผลการทำงาน",
          en: "Tracking goals and evaluating performance",
        },
      },
      {
        id: "q2_opt4",
        text: {
          th: "การจัดการเงินเดือนและข้อกฎหมายที่ซับซ้อน",
          en: "Managing complex payroll and legal regulations",
        },
      },
    ],
    type: "single-choice",
  },
  {
    id: 3,
    text: {
      th: "ก่อนมาเยี่ยมชมบูธวันนี้ คุณคุ้นเคยกับโซลูชันของ Humanica มากน้อยแค่ไหน?",
      en: "Before visiting the booth today, how familiar were you with Humanica's solutions?",
    },
    options: [
      {
        id: "q3_opt1",
        text: {
          th: "คุ้นเคยมาก - เคยใช้งานหรือติดตาม Humanica อยู่แล้ว",
          en: "Very familiar - already used or followed Humanica",
        },
      },
      {
        id: "q3_opt2",
        text: {
          th: "พอรู้จัก - เคยได้ยินชื่อหรือเห็นผ่านตามา",
          en: "Somewhat familiar - heard the name or seen it",
        },
      },
      {
        id: "q3_opt3",
        text: {
          th: "ไม่ค่อยรู้จัก - เพิ่งเริ่มรู้จักจากงานนี้",
          en: "Not very familiar - just learned about it at this event",
        },
      },
      {
        id: "q3_opt4",
        text: { th: "ไม่เคยรู้จักมาก่อนเลย", en: "Never heard of it before" },
      },
    ],
    type: "single-choice",
  },
  {
    id: 31,
    text: {
      th: "คุณคุ้นเคยกับผลิตภัณฑ์ หรือบริการใดของ Humanica มากที่สุด? (เลือกได้มากกว่า 1 ข้อ)",
      en: "Which Humanica products or services are you most familiar with? (Select more than one)",
    },
    required_id: 3, // This question is related to question 3
    required_id_answer_option_id: "q3_opt1", // Changed from text to option ID
    options: [
      {
        id: "q31_opt1",
        text: { th: "Payroll Outsourcing", en: "Payroll Outsourcing" },
      },
      {
        id: "q31_opt2",
        text: {
          th: "Workplaze HRIS Implementation",
          en: "Workplaze HRIS Implementation",
        },
      },
      {
        id: "q31_opt3",
        text: {
          th: "Wellbeing Solution (Benix/ Pharmcare)",
          en: "Wellbeing Solution (Benix/ Pharmcare)",
        },
      },
      { id: "q31_opt4", text: { th: "Humanica ERP", en: "Humanica ERP" } },
      {
        id: "q31_opt5",
        text: { th: "Humanica Consulting", en: "Humanica Consulting" },
      },
    ],
    type: "multiple-choice",
  },
  {
    id: 32,
    text: {
      th: "คุณเคยเห็นหรือได้ยินชื่อ Humanica จากช่องทางใดบ้าง? (เลือกได้มากกว่า 1 ข้อ)",
      en: "From which channels have you seen or heard of Humanica? (Select more than one)",
    },
    required_id: 3, // This question is related to question 3
    required_id_answer_option_id: "q3_opt2", // Changed from text to option ID
    options: [
      { id: "q32_opt1", text: { th: "Facebook", en: "Facebook" } },
      { id: "q32_opt2", text: { th: "LinkedIn", en: "LinkedIn" } },
      { id: "q32_opt3", text: { th: "Instagram", en: "Instagram" } },
      { id: "q32_opt4", text: { th: "YouTube", en: "YouTube" } },
      {
        id: "q32_opt5",
        text: {
          th: "ค้นหาจาก Google / เว็บไซต์",
          en: "Google Search / Website",
        },
      },
      {
        id: "q32_opt6",
        text: { th: "อีเมลหรือจดหมายข่าว", en: "Email or Newsletter" },
      },
      {
        id: "q32_opt7",
        text: { th: "งานอีเวนต์ / นิทรรศการ", en: "Events / Exhibitions" },
      },
      {
        id: "q32_opt8",
        text: {
          th: "เพื่อนหรือคนรู้จักแนะนำ",
          en: "Recommended by friends or acquaintances",
        },
      },
    ],
    type: "multiple-choice",
  },
  {
    id: 4,
    text: {
      th: "อะไรทำให้คุณแวะมาที่บูธ Humanica? (เลือกได้ 1 ข้อ)",
      en: "What made you visit the Humanica booth? (Select 1 option)",
    },
    options: [
      {
        id: "q4_opt1",
        text: { th: "การออกแบบบูธที่สะดุดตา", en: "Eye-catching booth design" },
      },
      {
        id: "q4_opt2",
        text: {
          th: "พนักงานเชิญชวนอย่างเป็นกันเอง",
          en: "Friendly staff invitation",
        },
      },
      {
        id: "q4_opt3",
        text: {
          th: "สนใจเทคโนโลยีหรือสินค้าในบูธ",
          en: "Interested in the technology or products at the booth",
        },
      },
      {
        id: "q4_opt4",
        text: {
          th: "เดินสำรวจทั่วไปแล้วบังเอิญเจอ",
          en: "Just exploring and happened to find it",
        },
      },
    ],
    type: "single-choice",
  },
  {
    id: 5,
    text: {
      th: "เทคโนโลยีหรือเนื้อหาแบบใดที่คุณอยากเห็นในงาน HR Tech ปีหน้า? (เลือกได้มากกว่า 1 ข้อ)",
      en: "What kind of technology or content would you like to see at HR Tech next year? (Select more than one)",
    },
    options: [
      {
        id: "q5_opt1",
        text: { th: "Generative AI สำหรับงาน HR", en: "Generative AI for HR" },
      },
      {
        id: "q5_opt2",
        text: {
          th: "แพลตฟอร์มดูแลสุขภาพจิตและความเป็นอยู่ของพนักงาน",
          en: "Platforms for employee mental health and well-being",
        },
      },
      {
        id: "q5_opt3",
        text: {
          th: "ระบบอัตโนมัติสำหรับ Employee Lifecycle",
          en: "Automation systems for Employee Lifecycle",
        },
      },
      {
        id: "q5_opt4",
        text: {
          th: "เครื่องมือ Performance Management ยุคใหม่",
          en: "Modern Performance Management tools",
        },
      },
      {
        id: "q5_opt5",
        text: {
          th: "ระบบสวัสดิการและค่าตอบแทนแบบยืดหยุ่น",
          en: "Flexible benefits and compensation systems",
        },
      },
      {
        id: "q5_opt6",
        text: {
          th: "นวัตกรรมด้านการเรียนรู้และพัฒนา (L&D)",
          en: "Innovations in Learning and Development (L&D)",
        },
      },
      {
        id: "q5_opt7",
        text: {
          th: "การวิเคราะห์ข้อมูลพนักงานและการคาดการณ์เชิงลึก",
          en: "Employee data analytics and predictive insights",
        },
      },
      {
        id: "q5_opt8",
        text: {
          th: "เทคโนโลยีด้านความหลากหลาย ความเสมอภาค และการมีส่วนร่วม (DEI)",
          en: "Technology for Diversity, Equity, and Inclusion (DEI)",
        },
      },
      {
        id: "q5_opt9",
        text: {
          th: "โซลูชันทางการเงินและ ERP เพื่อการบริหารจัดการองค์กรและทรัพยากรบุคคล",
          en: "Financial and ERP solutions for organizational and HR management",
        },
      },
      {
        id: "q5_opt10",
        text: {
          th: "กรณีศึกษาจริงขององค์กรที่เปลี่ยนผ่านด้วยเทคโนโลยี HR",
          en: "Real case studies of organizations transformed by HR technology",
        },
      },
    ],
    type: "multiple-choice",
  },
];

// Constants for animation classes and duration
const ANIMATION_IN_CLASS = "animate-slideInUp";
const ANIMATION_OUT_CLASS = "animate-slideOutUp";
const ANIMATION_DURATION = 500; // ms, must match CSS animation duration

// Helper function to get translated text
const getTranslatedText = (
  textObj: TranslatedText | undefined,
  lang: "en" | "th"
): string => {
  if (!textObj) return "";
  return textObj[lang] || textObj.en; // Fallback to English if translation missing or textObj is undefined for a language
};

const uiStrings = {
  welcomeTitle: { en: "Welcome to the Survey", th: "ยินดีต้อนรับสู่แบบสำรวจ" },
  startSurveyButton: { en: "Start New Survey", th: "เริ่มแบบสำรวจใหม่" },
  loadDataButton: {
    en: "Load All Survey Data",
    th: "โหลดข้อมูลแบบสำรวจทั้งหมด",
  },
  nextButton: { en: "Next", th: "ถัดไป" },
  finishSurveyButton: { en: "Finish Survey", th: "เสร็จสิ้นแบบสำรวจ" },
  surveyCompletedTitle: { en: "Survey Completed!", th: "ทำแบบสำรวจเสร็จสิ้น!" },
  thankYouMessage: {
    en: "Thank you for completing the survey.",
    th: "ขอบคุณที่ทำแบบสำรวจจนเสร็จสิ้น",
  },
  yourAnswersTitle: {
    en: "Your Answers for this Session:",
    th: "คำตอบของคุณสำหรับเซสชันนี้:",
  },
  restartSurveyButton: { en: "Restart Survey", th: "เริ่มแบบสำรวจใหม่" },
  noApplicableQuestionsTitle: {
    en: "No Applicable Questions",
    th: "ไม่มีคำถามที่เกี่ยวข้อง",
  },
  noApplicableQuestionsMessage: {
    en: "There are no questions for you in this survey at this time.",
    th: "ขณะนี้ไม่มีคำถามสำหรับคุณในแบบสำรวจนี้",
  },
  backToStartButton: { en: "Back to Start", th: "กลับไปหน้าเริ่มต้น" },
  progressText: {
    en: "Progress: {answered} / {total} main questions",
    th: "ความคืบหน้า: {answered} / {total} คำถามหลัก",
  },
  alertOptionNeeded: {
    en: "Please select at least one option before proceeding.",
    th: "กรุณาเลือกอย่างน้อยหนึ่งตัวเลือกก่อนดำเนินการต่อ",
  },
  loadedSurveyResponsesTitle: {
    en: "Survey Responses", // Generic, though this screen will be removed
    th: "ข้อมูลแบบสำรวจ",
  },
  lastSessionResponsesTitle: {
    en: "Last Session's Responses",
    th: "คำตอบของเซสชันล่าสุด",
  },
  answerLabel: {
    en: "Answer:",
    th: "คำตอบ:",
  },
};

// Helper function to check if a question should be displayed
const isQuestionDisplayable = (
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
      return false; // Condition not met
    }
  }
  return true; // No condition or condition met
};

// Helper function to find the index of the next displayable question
// Starts searching from startIndex (inclusive)
const findNextDisplayableQuestionIndex = (
  startIndex: number,
  answers: UserAnswer[]
): number => {
  for (let i = startIndex; i < questionsData.length; i++) {
    if (isQuestionDisplayable(questionsData[i], answers)) {
      return i;
    }
  }
  return -1; // No more displayable questions
};

// Helper function to generate a unique session ID
const generateNewSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

type AllSurveyResponsesMap = Record<string, UserAnswer[]>;

export default function SurveyComponent() {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "th">(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("surveyLanguage");
      return savedLang === "en" || savedLang === "th" ? savedLang : "th";
    }
    return "th";
  });

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
    useState<AllSurveyResponsesMap>(() => {
      // Load from localStorage on initial mount
      if (typeof window !== "undefined") {
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
                  // Basic validation for the answer object itself before pushing
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

            // Validate the (potentially migrated) new map format
            if (
              typeof dataToProcess === "object" &&
              dataToProcess !== null &&
              !Array.isArray(dataToProcess)
            ) {
              const isValidMap = Object.values(dataToProcess).every(
                (sessionAnswers) =>
                  Array.isArray(sessionAnswers) &&
                  sessionAnswers.every(
                    (ans: any): ans is UserAnswer =>
                      typeof ans.sessionId === "string" &&
                      typeof ans.timestamp === "number" &&
                      typeof ans.questionId === "number" &&
                      typeof ans.questionTextInSessionLanguage === "string" &&
                      typeof ans.selectedAnswerInSessionLanguage === "string" &&
                      Array.isArray(ans.selectedOptionIds) &&
                      ans.selectedOptionIds.every(
                        (id: any) => typeof id === "string"
                      ) &&
                      (ans.languageOfSubmission === "en" ||
                        ans.languageOfSubmission === "th")
                  )
              );
              if (isValidMap) {
                return dataToProcess as AllSurveyResponsesMap;
              }
            }
            console.warn(
              "localStorage allSurveyResponses is not in the expected AllSurveyResponsesMap format. Resetting."
            );
            localStorage.removeItem("allSurveyResponses");
          } catch (error) {
            console.error(
              "Error parsing survey responses from localStorage:",
              error
            );
            localStorage.removeItem("allSurveyResponses");
          }
        }
      }
      return {}; // Default to an empty object
    });

  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState<number>(
    () => {
      // This will be properly initialized in an effect after allSurveyResponses is loaded
      return 0;
    }
  );
  const [lastCompletedSessionAnswers, setLastCompletedSessionAnswers] =
    useState<UserAnswer[] | null>(null);
  const animatedBoxRef = useRef<HTMLDivElement>(null); // Renamed and will be moved to the outer box
  const currentAnimationClassRef = useRef<string | null>(null); // Tracks the currently applied animation class (IN or OUT)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize totalSessionsCompleted based on loaded allSurveyResponses
  useEffect(() => {
    setTotalSessionsCompleted(Object.keys(allSurveyResponses).length);
  }, [allSurveyResponses]);

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
          // Update totalSessionsCompleted based on the new map's size
          setTotalSessionsCompleted(Object.keys(newMap).length);
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
  }, [
    currentQuestionIndex,
    userAnswers,
    showCompletionScreen,
    // viewingSpecificAnswersSet removed
  ]);

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
    // If you want to reset the session count on a full "restart" of the app's data,
    // you might consider uncommenting the next line.
    // However, typically, this count would persist like allSurveyResponses.
    // setTotalSessionsCompleted(0);
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

  if (showCompletionScreen) {
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
                        (q) => q.id === answer.questionId
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
  }

  // If not on a special screen, and currentQuestion is null, it means no questions are applicable.
  // (and currentQuestionIndex is not -1, because that's the welcome screen)
  if (
    !currentQuestion &&
    currentQuestionIndex !== -1 &&
    !showCompletionScreen // viewingSpecificAnswersSet removed
  ) {
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
          onClick={restartSurvey} // Or a button to go "Back to Main / Welcome"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
        >
          {getTranslatedText(uiStrings.backToStartButton, currentLanguage)}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={animatedBoxRef}
      className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md"
    >
      {" "}
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
        {" "}
        {/* This inner div no longer needs a ref for animation */}
        {/* Progress Bar */}
        {totalMainQuestions > 0 && currentQuestion && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 text-right">
              {getTranslatedText(uiStrings.progressText, currentLanguage)
                .replace("{answered}", answeredMainQuestions.toString())
                .replace("{total}", totalMainQuestions.toString())}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
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
          <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300">
            {currentQuestion
              ? getTranslatedText(currentQuestion.text, currentLanguage)
              : ""}
          </p>
        </div>
        <div className="space-y-3 mb-8">
          {currentQuestion?.options.map((optionObj) => (
            <label
              key={optionObj.id} // Use optionObj.id for key
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
    </div>
  );
}
