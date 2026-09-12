export const teacher = {
  name: "Teacher",
  medium: "Hindi Medium",
};

export const classInfo = {
  grade: "Class 2",
  subject: "Mathematics",
};

export const currentLesson = {
  topic: "Numbers 1–10",
  outcome: "Child can count and identify objects from 1 to 10.",
  status: "Ready",
  duration: "20 min",
  language: "Santali • Ol Chiki",
};

export const classStats = {
  students: 28,
  lessonCompletion: 71,
  correctResponses: 78,
  participation: 84,
};

export const recentActivity = [
  {
    id: 1,
    text: "12 students completed Numbers 1–10",
    type: "success",
  },
  {
    id: 2,
    text: "3 students need reinforcement",
    type: "warning",
  },
  {
    id: 3,
    text: "5 new verified Santali phrases added",
    type: "info",
  },
];

export const teachingTools = [
  {
    id: "ai-lesson",
    title: "AI Lesson",
    description: "Generate a mother-tongue lesson from a curriculum topic.",
    icon: "Sparkles",
    route: "lesson-builder",
  },
  {
    id: "live-classroom",
    title: "Live Classroom",
    description: "Run the shared-screen classroom session.",
    icon: "MonitorPlay",
    route: "classroom",
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Practice vocabulary and numbers.",
    icon: "Layers",
    route: "flashcards",
  },
  {
    id: "worksheet",
    title: "Worksheet",
    description: "Generate a printable practice sheet.",
    icon: "FileText",
    route: "worksheets",
  },
  {
    id: "assessment",
    title: "Assessment",
    description: "Check class mastery and get recommendations.",
    icon: "ClipboardCheck",
    route: "assessment",
  },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "my-lessons", label: "My Lessons", icon: "BookOpen" },
  { id: "lesson-builder", label: "AI Lesson Builder", icon: "Sparkles" },
  { id: "classroom", label: "Live Classroom", icon: "MonitorPlay" },
  { id: "flashcards", label: "Flashcards", icon: "Layers" },
  { id: "worksheets", label: "Worksheets", icon: "FileText" },
  { id: "assessment", label: "Assessments", icon: "ClipboardCheck" },
  { id: "progress", label: "Progress", icon: "TrendingUp" },
];
export const classroomSession = {
  elapsedStartMinutes: 12, // demo: class already 12 min in when page loads
  studentsPresent: 26,
  studentsTotal: 28,
  isOnline: true,
};

export const teacherSpeech = {
  hindi: "बच्चों, गिनो कि यहाँ कितने सेब हैं।",
};

export const classroomDisplay = {
  activityTitle: "Count the Apples",
  objectCount: 5,
  olChiki: "ᱱᱚᱣᱟ ᱠᱚᱛᱮ ᱟᱢ?",
  englishGloss: "How many apples?",
};

export const studentResponse = {
  olChiki: "ᱯᱟᱸᱪ",
  hindiMeaning: "Five",
  confidence: 94,
};

export const pipelineStages = [
  "Hindi Speech",
  "Hindi ASR",
  "Classroom Context",
  "Hindi → Santali",
  "Santali Voice",
];

export const flowStages = [
  "Teacher Speaks",
  "AI Understands",
  "Santali Audio",
  "Child Responds",
  "AI Translates",
  "Assessment",
];
export const lessonBuilderForm = {
  grade: "Class 2",
  subject: "Mathematics",
  topic: "Numbers 1–10",
  outcome: "Child can count objects from 1 to 10.",
  teachingLanguage: "Hindi",
  classroomLanguage: "Santali • Ol Chiki",
  duration: "30 minutes",
};

export const lessonPipelineStages = [
  "Curriculum",
  "Pedagogy",
  "Activity",
  "Language",
  "Assessment",
];

export const generatedLesson = {
  title: "Counting Numbers 1–10",
  outcome: "Child can count objects from 1 to 10.",
  teacherHindi: "बच्चों, इन सेबों को गिनो। एक, दो, तीन, चार, पाँच।",
  teacherSantali: "Santali translation preview",
  confidence: 94,
};

export const builderActivity = {
  title: "Count the Apples",
  objectCount: 5,
  instructionTeacher: "Count the objects shown on the screen.",
  expectedAnswer: "5",
  type: "Visual + Verbal",
  difficulty: "Beginner",
};

export const builderQuestions = [
  { id: 1, question: "How many apples are there?", answer: "5", difficulty: "Beginner", language: "Santali" },
  { id: 2, question: "Count from 1 to 10.", answer: "1–10", difficulty: "Beginner", language: "Santali" },
  { id: 3, question: "Show me 7 objects.", answer: "7", difficulty: "Beginner", language: "Santali" },
];

export const worksheetItems = [
  "Count the objects",
  "Match number to objects",
  "Trace numbers",
  "Simple classroom exercise",
];

export const flashcardPreview = [
  { id: 1, count: 1, label: "1" },
  { id: 2, count: 2, label: "2" },
  { id: 3, count: 3, label: "3" },
];

export const lessonIncludes = [
  "Explanation",
  "Activity",
  "Visuals",
  "Questions",
  "Assessment",
  "Adaptive Learning",
  "Worksheet",
  "Flashcards",
];
export const flashcardSet = {
  title: "Numbers 1–10",
  outcome: "Child can count objects from 1 to 10.",
  cardCount: 10,
  mode: "Visual + Verbal",
  language: "Santali • Ol Chiki",
  difficulty: "Beginner",
};

export const flashcards = [
  { id: 1, value: "1", visualCount: 1, hindi: "एक", olChiki: "Translation pending verification", english: "One", verified: false },
  { id: 2, value: "2", visualCount: 2, hindi: "दो", olChiki: "Translation pending verification", english: "Two", verified: false },
  { id: 3, value: "3", visualCount: 3, hindi: "तीन", olChiki: "Translation pending verification", english: "Three", verified: false },
  { id: 4, value: "4", visualCount: 4, hindi: "चार", olChiki: "Translation pending verification", english: "Four", verified: false },
  { id: 5, value: "5", visualCount: 5, hindi: "पाँच", olChiki: "Translation pending verification", english: "Five", verified: false },
  { id: 6, value: "6", visualCount: 6, hindi: "छह", olChiki: "Translation pending verification", english: "Six", verified: false },
  { id: 7, value: "7", visualCount: 7, hindi: "सात", olChiki: "Translation pending verification", english: "Seven", verified: false },
  { id: 8, value: "8", visualCount: 8, hindi: "आठ", olChiki: "Translation pending verification", english: "Eight", verified: false },
  { id: 9, value: "9", visualCount: 9, hindi: "नौ", olChiki: "Translation pending verification", english: "Nine", verified: false },
  { id: 10, value: "10", visualCount: 10, hindi: "दस", olChiki: "Translation pending verification", english: "Ten", verified: false },
];

export const practiceModes = [
  {
    id: "show-tell",
    title: "Show & Tell",
    description: "Child sees objects and says the number.",
  },
  {
    id: "listen-choose",
    title: "Listen & Choose",
    description: "Child hears the number and chooses the correct visual.",
  },
  {
    id: "count-respond",
    title: "Count & Respond",
    description: "Child counts objects shown on screen and responds verbally.",
  },
];

export const adaptationPreview = {
  studentResponse: "Incorrect",
  recommendation: "Repeat visual counting with fewer objects.",
  nextActivity: "Count 3 objects",
};
export const worksheetConfig = {
  grade: "Class 2",
  subject: "Mathematics",
  topic: "Numbers 1–10",
  outcome: "Child can count objects from 1 to 10.",
  teachingLanguage: "Hindi Teacher → Santali • Ol Chiki",
  difficulty: "Beginner",
  worksheetType: "Practice",
  questionCount: 6,
  format: "A4 Printable",
};

export const worksheetQuestions = [
  { id: 1, prompt: "Count the objects and write the number.", visualCount: 3 },
  { id: 2, prompt: "Count the objects and write the number.", visualCount: 7 },
  { id: 3, prompt: "Match the number to the correct group.", visualCount: 5 },
  { id: 4, prompt: "How many objects are there?", visualCount: 9 },
  { id: 5, prompt: "How many objects are there?", visualCount: 2 },
  { id: 6, prompt: "Count the objects and write the number.", visualCount: 6 },
];

export const worksheetSections = [
  {
    id: "count",
    letter: "A",
    title: "Count the Objects",
    description: "Show visual groups of objects and write the number.",
  },
  {
    id: "match",
    letter: "B",
    title: "Match",
    description: "Match numbers on one side to object groups on the other.",
  },
  {
    id: "trace",
    letter: "C",
    title: "Trace the Numbers",
    description: "Trace 1 2 3 4 5 in large child-friendly style.",
  },
  {
    id: "answer",
    letter: "D",
    title: "Count and Answer",
    description: "Count the objects shown and write the answer.",
  },
];

export const worksheetPipeline = [
  "Learning Outcome",
  "Question Generation",
  "Visual Activity",
  "Language Layer",
  "FLN Alignment",
  "Teacher Review",
];
export const assessmentSummary = {
  studentsAssessed: 26,
  studentsTotal: 28,
  mastery: 78,
  correctResponses: 78,
  needsReinforcement: 6,
};

export const assessmentQuestions = [
  {
    id: 1,
    title: "Count the objects",
    prompt: "How many objects are shown?",
    visualCount: 5,
    expectedAnswer: "5",
    correct: 20,
    incorrect: 4,
    noResponse: 2,
  },
  {
    id: 2,
    title: "Count from 1 to 10",
    prompt: "Count from 1 to 10.",
    visualCount: 10,
    expectedAnswer: "1–10",
    correct: 21,
    incorrect: 3,
    noResponse: 2,
  },
  {
    id: 3,
    title: "Match numeral to objects",
    prompt: "Which group represents the number 4?",
    visualCount: 4,
    expectedAnswer: "4",
    correct: 19,
    incorrect: 5,
    noResponse: 2,
  },
  {
    id: 4,
    title: "Count 7 objects",
    prompt: "How many objects are shown?",
    visualCount: 7,
    expectedAnswer: "7",
    correct: 18,
    incorrect: 6,
    noResponse: 2,
  },
  {
    id: 5,
    title: "Identify the larger group",
    prompt: "Which group has more objects?",
    visualCount: 8,
    expectedAnswer: "8",
    correct: 22,
    incorrect: 2,
    noResponse: 2,
  },
  {
    id: 6,
    title: "Count and answer",
    prompt: "Count the objects and say the number.",
    visualCount: 6,
    expectedAnswer: "6",
    correct: 20,
    incorrect: 4,
    noResponse: 2,
  },
];

export const learningSignals = [
  { id: "strong", label: "Strong", title: "Counts objects accurately", students: 22 },
  { id: "watch", label: "Watch", title: "Needs slower visual counting", students: 3 },
  { id: "reinforce", label: "Reinforce", title: "Confuses quantity and numeral", students: 3 },
];

export const masteryBreakdown = [
  { id: "mastered", label: "Mastered", students: 20, percentage: 77 },
  { id: "developing", label: "Developing", students: 3, percentage: 12 },
  { id: "support", label: "Needs Support", students: 3, percentage: 11 },
];

export const adaptiveRecommendation = {
  title: "Reinforce counting with smaller groups",
  reason: "Some learners are struggling to connect the number of objects with the written numeral.",
  currentActivity: "Count 5 objects",
  recommendedActivity: "Count 3 objects",
  sequence: "Visual counting → verbal response → retry",
};
export const lessonOverview = {
  total: 6,
  readyToTeach: 3,
  needsReview: 2,
  drafts: 1,
};

export const lessonFilterOptions = {
  grades: ["All Grades", "Class 1", "Class 2", "Class 3"],
  subjects: ["All Subjects", "Mathematics", "Language", "EVS"],
  statuses: ["All", "Ready", "Draft", "Needs Review"],
  languages: ["All Languages", "Santali • Ol Chiki", "Hindi"],
};

export const lessonLibrary = [
  {
    id: 1,
    title: "Counting Numbers 1–10",
    grade: "Class 2",
    subject: "Mathematics",
    topic: "Numbers 1–10",
    outcome: "Child can count objects from 1 to 10.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Santali • Ol Chiki",
    duration: "30 minutes",
    status: "Ready",
    languageStatus: "Pending verification",
    updated: "2 days ago",
  },
  {
    id: 2,
    title: "Shapes Around Us",
    grade: "Class 1",
    subject: "Mathematics",
    topic: "Basic Shapes",
    outcome: "Child can identify circle, square and triangle.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Santali • Ol Chiki",
    duration: "25 minutes",
    status: "Ready",
    languageStatus: "Pending verification",
    updated: "5 days ago",
  },
  {
    id: 3,
    title: "My Family Words",
    grade: "Class 1",
    subject: "Language",
    topic: "Family Vocabulary",
    outcome: "Child can name immediate family members.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Santali • Ol Chiki",
    duration: "20 minutes",
    status: "Needs Review",
    languageStatus: "Pending verification",
    updated: "1 week ago",
  },
  {
    id: 4,
    title: "Plants Around School",
    grade: "Class 3",
    subject: "EVS",
    topic: "Living Things",
    outcome: "Child can identify common plants near school.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Hindi",
    duration: "35 minutes",
    status: "Draft",
    languageStatus: "Not applicable",
    updated: "2 weeks ago",
  },
  {
    id: 5,
    title: "Addition up to 10",
    grade: "Class 2",
    subject: "Mathematics",
    topic: "Simple Addition",
    outcome: "Child can add two numbers with a sum up to 10.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Santali • Ol Chiki",
    duration: "30 minutes",
    status: "Ready",
    languageStatus: "Pending verification",
    updated: "3 weeks ago",
  },
  {
    id: 6,
    title: "Days of the Week",
    grade: "Class 1",
    subject: "Language",
    topic: "Calendar Vocabulary",
    outcome: "Child can name the days of the week in order.",
    teachingLanguage: "Hindi",
    classroomLanguage: "Santali • Ol Chiki",
    duration: "20 minutes",
    status: "Needs Review",
    languageStatus: "Pending verification",
    updated: "1 month ago",
  },
];
export const learningGaps = [
  {
    id: "quantity-numeral",
    title: "Quantity → Numeral",
    description: "Some learners can count objects but struggle to connect the quantity with the written numeral.",
    status: "Needs Reinforcement",
  },
  {
    id: "visual-counting",
    title: "Visual Counting",
    description: "A small group benefits from slower counting with smaller visual groups.",
    status: "Watch",
  },
  {
    id: "verbal-response",
    title: "Verbal Response",
    description: "Some learners need another opportunity to count and answer verbally.",
    status: "Developing",
  },
];

export const topicSkillProgress = [
  { id: "count-objects", label: "Count objects", percentage: 90 },
  { id: "recognize-numerals", label: "Recognize numerals", percentage: 82 },
  { id: "match-quantity", label: "Match quantity to numeral", percentage: 68 },
  { id: "count-verbally", label: "Count verbally", percentage: 75 },
];

export const learningLoopStages = [
  "Teach",
  "Interact",
  "Assess",
  "Identify Gap",
  "Reinforce",
  "Reassess",
];