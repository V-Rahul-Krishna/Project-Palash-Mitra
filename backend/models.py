from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from datetime import datetime
from database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    grade = Column(String)
    subject = Column(String)
    topic = Column(String)
    outcome = Column(Text)
    teaching_language = Column(String)
    classroom_language = Column(String)


# NOTE for Rahul (M1): this is a MINIMAL placeholder Student model,
# added by M4 only because Assessment submissions need a student_id
# to belong to. Please review/expand this as Core Platform needs
# (e.g. class/school info, login, etc.) - M4 only added what was
# needed to unblock assessment work.
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Skill(Base):
    """A skill/concept being tested, e.g. 'Number Recognition'."""
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)


class Assessment(Base):
    """A set of questions tied to a learning outcome (optionally a Lesson)."""
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    title = Column(String)
    learning_outcome = Column(Text, nullable=True)


class Question(Base):
    """One question inside an Assessment."""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)

    # question_type: "mcq" | "numeric" | "true_false" | "text"
    question_type = Column(String)
    prompt = Column(Text)

    # For MCQ: comma-separated options stored as plain text, e.g. "A:Cat,B:Dog,C:Fish"
    # Kept simple (no JSON column) since this is SQLite + MVP.
    options = Column(Text, nullable=True)

    correct_answer = Column(String)
    difficulty = Column(String, default="medium")


class AssessmentSubmission(Base):
    """One student's completed attempt at an Assessment, with computed results."""
    __tablename__ = "assessment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    student_id = Column(Integer, ForeignKey("students.id"))

    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    score_percentage = Column(Float)

    mastery_status = Column(String)

    # Stored as JSON text (SQLite has no native JSON type in this simple setup):
    # skill_performance example: {"Counting": {"correct": 4, "total": 4, "percentage": 100.0}, ...}
    skill_performance = Column(Text)
    # learning_gaps example: [{"skill": "Number Recognition", "percentage": 25.0, "severity": "Major"}]
    learning_gaps = Column(Text)
    # reinforcement_recommendation example: ["Show fewer objects", "Retry easier questions"]
    reinforcement_recommendation = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)


class StudentAnswer(Base):
    """One answer a student gave to one question, inside one submission."""
    __tablename__ = "student_answers"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("assessment_submissions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))

    given_answer = Column(String)
    is_correct = Column(Boolean)