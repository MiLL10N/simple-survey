import { Question, TranslatedText } from "./survey.types";

export const questionsData: Question[] = [
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
    required_id: 3,
    required_id_answer_option_id: "q3_opt1",
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
    required_id: 3,
    required_id_answer_option_id: "q3_opt2",
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

export const ANIMATION_IN_CLASS = "animate-slideInUp";
export const ANIMATION_OUT_CLASS = "animate-slideOutUp";
export const ANIMATION_DURATION = 500;

export const uiStrings: Record<string, TranslatedText> = {
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
    en: "Survey Responses",
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