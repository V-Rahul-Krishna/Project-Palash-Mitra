from pydantic import BaseModel
from typing import Optional


class LessonCreate(BaseModel):
    grade: str
    subject: str
    topic: str
    outcome: str
    teaching_language: str
    classroom_language: str


class LessonResponse(LessonCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- M4: Assessment schemas ----------

class QuestionCreate(BaseModel):
    question_type: str          # "mcq" | "numeric" | "true_false" | "text"
    prompt: str
    options: Optional[str] = None   # e.g. "A:Cat,B:Dog,C:Fish" (only for mcq)
    correct_answer: str
    skill_name: Optional[str] = None   # e.g. "Number Recognition"
    difficulty: str = "medium"


class QuestionResponse(BaseModel):
    id: int
    question_type: str
    prompt: str
    options: Optional[str] = None
    difficulty: str
    skill_id: Optional[int] = None
    # NOTE: correct_answer is deliberately left out of the response
    # so a student-facing screen doesn't accidentally leak the answer.

    class Config:
        from_attributes = True


class AssessmentCreate(BaseModel):
    title: str
    lesson_id: Optional[int] = None
    learning_outcome: Optional[str] = None
    questions: list[QuestionCreate]


class AssessmentResponse(BaseModel):
    id: int
    title: str
    lesson_id: Optional[int] = None
    learning_outcome: Optional[str] = None
    questions: list[QuestionResponse]

    class Config:
        from_attributes = True


class AnswerSubmit(BaseModel):
    question_id: int
    answer: str


class SubmissionRequest(BaseModel):
    student_id: int
    answers: list[AnswerSubmit]


class SkillPerformanceItem(BaseModel):
    skill: str
    correct: int
    total: int
    percentage: float


class LearningGapItem(BaseModel):
    skill: str
    percentage: float
    severity: str


class SubmissionResult(BaseModel):
    submission_id: int
    assessment_id: int
    student_id: int
    total_questions: int
    correct_answers: int
    score_percentage: float
    mastery_status: str
    skill_performance: list[SkillPerformanceItem]
    learning_gaps: list[LearningGapItem]
    reinforcement_recommendation: list[str]