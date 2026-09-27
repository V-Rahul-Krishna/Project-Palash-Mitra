from pydantic import BaseModel
from typing import Optional, List, Any


# =========================
# LESSON SCHEMAS
# =========================

class LessonCreate(BaseModel):
    grade: str
    subject: str
    topic: str
    outcome: str
    teaching_language: str
    classroom_language: str
    status: str = "Draft"
    duration: str = "25 min"
    language_status: str = "Pending verification"


class LessonResponse(LessonCreate):
    id: int

    class Config:
        from_attributes = True


# =========================
# ASSESSMENT SCHEMAS
# =========================

class QuestionCreate(BaseModel):
    skill_name: Optional[str] = None
    question_type: str
    prompt: str
    options: Optional[Any] = None
    correct_answer: str
    difficulty: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    skill_id: Optional[int] = None
    question_type: str
    prompt: str
    options: Optional[Any] = None
    difficulty: Optional[str] = None

    class Config:
        from_attributes = True


class AssessmentCreate(BaseModel):
    lesson_id: Optional[int] = None
    title: str
    learning_outcome: Optional[str] = None
    questions: List[QuestionCreate]


class AssessmentResponse(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    title: str
    learning_outcome: Optional[str] = None
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


# =========================
# SUBMISSION SCHEMAS
# =========================

class AnswerSubmit(BaseModel):
    question_id: int
    answer: str


class SubmissionRequest(BaseModel):
    student_id: int
    answers: List[AnswerSubmit]


class SkillPerformanceItem(BaseModel):
    skill: Optional[str] = None
    total_questions: int
    correct_answers: int
    score_percentage: float


class LearningGapItem(BaseModel):
    skill: Optional[str] = None
    score_percentage: float
    severity: str


class SubmissionResult(BaseModel):
    submission_id: int
    assessment_id: int
    student_id: int

    total_questions: int
    correct_answers: int
    score_percentage: float
    mastery_status: str

    skill_performance: List[SkillPerformanceItem]
    learning_gaps: List[LearningGapItem]
    reinforcement_recommendation: List[Any]
