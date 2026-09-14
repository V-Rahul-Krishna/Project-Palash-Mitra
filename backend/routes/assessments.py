"""
M4 - Assessment + Learning Gaps
Routes are kept thin: they handle HTTP/DB plumbing and call into
services/assessment.py for all the actual logic.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Assessment, Question, Skill, StudentAnswer, AssessmentSubmission, Student
from schemas import (
    AssessmentCreate,
    AssessmentResponse,
    SubmissionRequest,
    SubmissionResult,
)
import services.assessment as assessment_service

router = APIRouter(prefix="/assessments", tags=["Assessments"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_or_create_skill(db: Session, skill_name: str | None) -> int | None:
    """Look up a Skill by name, creating it if it doesn't exist yet."""
    if not skill_name:
        return None

    skill = db.query(Skill).filter(Skill.name == skill_name).first()
    if skill:
        return skill.id

    skill = Skill(name=skill_name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill.id


@router.post("/", response_model=AssessmentResponse)
def create_assessment(data: AssessmentCreate, db: Session = Depends(get_db)):
    assessment = Assessment(
        title=data.title,
        lesson_id=data.lesson_id,
        learning_outcome=data.learning_outcome,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    for question_data in data.questions:
        skill_id = get_or_create_skill(db, question_data.skill_name)
        question = Question(
            assessment_id=assessment.id,
            skill_id=skill_id,
            question_type=question_data.question_type,
            prompt=question_data.prompt,
            options=question_data.options,
            correct_answer=question_data.correct_answer,
            difficulty=question_data.difficulty,
        )
        db.add(question)

    db.commit()
    db.refresh(assessment)

    return _build_assessment_response(assessment, db)


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return _build_assessment_response(assessment, db)


def _build_assessment_response(assessment: Assessment, db: Session) -> AssessmentResponse:
    """
    There's no SQLAlchemy relationship() set up between Assessment and
    Question (kept simple/explicit for this MVP), so we query questions
    separately and build the response by hand instead of relying on
    from_attributes to walk a relationship that doesn't exist.
    """
    questions = db.query(Question).filter(Question.assessment_id == assessment.id).all()
    return AssessmentResponse(
        id=assessment.id,
        title=assessment.title,
        lesson_id=assessment.lesson_id,
        learning_outcome=assessment.learning_outcome,
        questions=questions,
    )


@router.post("/{assessment_id}/submit", response_model=SubmissionResult)
def submit_assessment(
    assessment_id: int,
    data: SubmissionRequest,
    db: Session = Depends(get_db),
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    questions = db.query(Question).filter(Question.assessment_id == assessment_id).all()
    questions_by_id = {q.id: q for q in questions}

    question_results = []  # for skill performance calculation
    answer_rows = []       # StudentAnswer rows to save, once we have a submission id

    for submitted_answer in data.answers:
        question = questions_by_id.get(submitted_answer.question_id)
        if not question:
            # Skip answers for questions that don't belong to this assessment
            continue

        correct = assessment_service.is_answer_correct(question, submitted_answer.answer)

        skill_name = None
        if question.skill_id:
            skill = db.query(Skill).filter(Skill.id == question.skill_id).first()
            skill_name = skill.name if skill else None

        question_results.append({"skill": skill_name, "is_correct": correct})
        answer_rows.append({
            "question_id": question.id,
            "given_answer": submitted_answer.answer,
            "is_correct": correct,
        })

    total_questions = len(question_results)
    correct_answers = sum(1 for r in question_results if r["is_correct"])
    score_percentage = round((correct_answers / total_questions) * 100, 1) if total_questions else 0.0

    skill_performance = assessment_service.calculate_skill_performance(question_results)
    learning_gaps = assessment_service.identify_learning_gaps(skill_performance)
    reinforcement = assessment_service.recommend_reinforcement(learning_gaps)
    mastery_status = assessment_service.get_mastery_status(score_percentage)

    submission = AssessmentSubmission(
        assessment_id=assessment_id,
        student_id=data.student_id,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score_percentage=score_percentage,
        mastery_status=mastery_status,
        skill_performance=assessment_service.to_json(skill_performance),
        learning_gaps=assessment_service.to_json(learning_gaps),
        reinforcement_recommendation=assessment_service.to_json(reinforcement),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    for row in answer_rows:
        db.add(StudentAnswer(
            submission_id=submission.id,
            question_id=row["question_id"],
            given_answer=row["given_answer"],
            is_correct=row["is_correct"],
        ))
    db.commit()

    # Reshape skill_performance dict into the list-of-objects shape SubmissionResult expects
    skill_performance_list = [
        {"skill": name, **perf} for name, perf in skill_performance.items()
    ]

    return SubmissionResult(
        submission_id=submission.id,
        assessment_id=assessment_id,
        student_id=data.student_id,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score_percentage=score_percentage,
        mastery_status=mastery_status,
        skill_performance=skill_performance_list,
        learning_gaps=learning_gaps,
        reinforcement_recommendation=reinforcement,
    )


@router.get("/submissions/{submission_id}/result", response_model=SubmissionResult)
def get_submission_result(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(AssessmentSubmission).filter(
        AssessmentSubmission.id == submission_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    skill_performance = assessment_service.from_json(submission.skill_performance) or {}
    skill_performance_list = [
        {"skill": name, **perf} for name, perf in skill_performance.items()
    ]

    return SubmissionResult(
        submission_id=submission.id,
        assessment_id=submission.assessment_id,
        student_id=submission.student_id,
        total_questions=submission.total_questions,
        correct_answers=submission.correct_answers,
        score_percentage=submission.score_percentage,
        mastery_status=submission.mastery_status,
        skill_performance=skill_performance_list,
        learning_gaps=assessment_service.from_json(submission.learning_gaps) or [],
        reinforcement_recommendation=assessment_service.from_json(
            submission.reinforcement_recommendation
        ) or [],
    )
