"""
PALASH MITRA - Pedagogy Engine

M3 Module

This module decides how a lesson should be taught
to an elementary school student.
"""


# ---------------------------------------------------------
# 1. LEARNING OUTCOME
# ---------------------------------------------------------

def generate_learning_outcome(class_level, subject, topic):
    """
    Define what the student should learn.
    """

    return (
        f"The student will understand {topic} "
        f"and apply the concept through simple activities."
    )


# ---------------------------------------------------------
# 2. EXPLANATION
# ---------------------------------------------------------

def generate_explanation(class_level, subject, topic):
    """
    Create a simple, child-friendly explanation.
    """

    return {
        "title": topic,
        "style": "child_friendly",
        "use_visuals": True,
        "text": (
            f"Let's learn about {topic} "
            f"using simple examples."
        )
    }


# ---------------------------------------------------------
# 3. DIFFICULTY
# ---------------------------------------------------------

def select_difficulty(previous_mastery=None):
    """
    Decide the starting difficulty.

    No previous performance -> Easy
    Below 60% -> Easy
    60-79% -> Medium
    80% or above -> Hard
    """

    if previous_mastery is None:
        return "easy"

    if previous_mastery < 0.60:
        return "easy"

    if previous_mastery < 0.80:
        return "medium"

    return "hard"


# ---------------------------------------------------------
# 4. ACTIVITY
# ---------------------------------------------------------

def generate_activity(subject, topic, difficulty):
    """
    Select an interactive activity based on
    subject and difficulty.
    """

    if subject == "Mathematics":

        if difficulty == "easy":
            activity_type = "count_and_select"

        elif difficulty == "medium":
            activity_type = "choose_answer"

        else:
            activity_type = "complete"

    elif subject == "EVS":

        if difficulty == "easy":
            activity_type = "picture_identify"

        elif difficulty == "medium":
            activity_type = "match"

        else:
            activity_type = "choose_answer"

    else:

        if difficulty == "easy":
            activity_type = "picture_identify"

        elif difficulty == "medium":
            activity_type = "match"

        else:
            activity_type = "complete"

    return {
        "type": activity_type,
        "topic": topic,
        "difficulty": difficulty,
        "interactive": True
    }


# ---------------------------------------------------------
# 5. PRACTICE
# ---------------------------------------------------------

def generate_practice(difficulty):
    """
    Define guided and independent practice.
    """

    if difficulty == "easy":
        guided_questions = 3
        independent_questions = 3

    elif difficulty == "medium":
        guided_questions = 3
        independent_questions = 4

    else:
        guided_questions = 3
        independent_questions = 5

    return {
        "guided": {
            "question_count": guided_questions,
            "difficulty": difficulty,
            "hints_enabled": True
        },

        "independent": {
            "question_count": independent_questions,
            "difficulty": difficulty,
            "hints_enabled": False
        }
    }


# ---------------------------------------------------------
# 6. COMPLETE LESSON
# ---------------------------------------------------------

def generate_lesson(
    class_level,
    subject,
    topic,
    student_level="beginner",
    previous_mastery=None

):
    """
    Generate the complete pedagogical structure.
    """

    difficulty = select_difficulty(previous_mastery)

    learning_outcome = generate_learning_outcome(
        class_level,
        subject,
        topic
    )

    explanation = generate_explanation(
        class_level,
        subject,
        topic
    )

    activity = generate_activity(
        subject,
        topic,
        difficulty
    )

    practice = generate_practice(difficulty)

    assessment = {
        "question_count": 5,
        "mastery_threshold": 0.80
    }

    return {
        "class_level": class_level,
        "subject": subject,
        "topic": topic,
        "student_level": student_level,

        "learning_outcome": learning_outcome,

        "explanation": explanation,

        "activity": activity,

        "guided_practice": practice["guided"],

        "independent_practice": practice["independent"],

        "assessment": assessment
    }


# ---------------------------------------------------------
# TEST THE PEDAGOGY ENGINE
# ---------------------------------------------------------

if __name__ == "__main__":

    lesson = generate_lesson(
        class_level=2,
        subject="Mathematics",
        topic="Addition up to 20"
    )

    print(lesson)