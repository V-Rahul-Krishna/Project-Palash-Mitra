from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Float,
    DateTime,
)

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
    status = Column(String, default="Draft")
    duration = Column(String, default="25 min")
    language_status = Column(String, default="Pending verification")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    title = Column(String, nullable=False)
    learning_outcome = Column(Text, nullable=True)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    question_type = Column(String, nullable=False)
    prompt = Column(Text, nullable=False)
    options = Column(Text, nullable=True)
    correct_answer = Column(Text, nullable=False)
    difficulty = Column(String, nullable=True)


class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    score_percentage = Column(Float, default=0.0)
    mastery_status = Column(String)
    skill_performance = Column(Text)
    learning_gaps = Column(Text)
    reinforcement_recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class StudentAnswer(Base):
    __tablename__ = "student_answers"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(
        Integer,
        ForeignKey("assessment_submissions.id"),
        nullable=False
    )
    question_id = Column(
        Integer,
        ForeignKey("questions.id"),
        nullable=False
    )
    given_answer = Column(Text)
    is_correct = Column(Integer, default=0)
