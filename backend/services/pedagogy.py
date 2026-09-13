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
    Generate an interactive activity based on
    subject, topic and difficulty.
    """

    # -------------------------------------------------
    # Mathematics - Addition up to 20
    # -------------------------------------------------

    if subject == "Mathematics" and topic == "Addition up to 20":

        activities = {

            "easy": {
                "type": "count_and_select",
                "instruction": "Count the objects and choose the correct answer.",

                "questions": [
                    {
                        "question": "🍎🍎 + 🍎 = ?",
                        "options": [2, 3, 4],
                        "answer": 3,
                        "hint": "Count all the apples together.",
                        "visual_support": True
                    },
                    {
                        "question": "⭐ ⭐ + ⭐ ⭐ = ?",
                        "options": [3, 4, 5],
                        "answer": 4,
                        "hint": "Count all the stars together.",
                        "visual_support": True
                    },
                    {
                        "question": "🖍️ 🖍️ 🖍️ + 🖍️ = ?",
                        "options": [3, 4, 5],
                        "answer": 4,
                        "hint": "Count the crayons in both groups.",
                        "visual_support": True
                    }
                ]
            },

            "medium": {
                "type": "choose_answer",
                "instruction": "Solve the addition problem and choose the correct answer.",

                "questions": [
                    {
                        "question": "4 + 3 = ?",
                        "options": [6, 7, 8],
                        "answer": 7,
                        "hint": "Start with 4 and count 3 more."
                    },
                    {
                        "question": "6 + 2 = ?",
                        "options": [7, 8, 9],
                        "answer": 8,
                        "hint": "Start with 6 and count 2 more."
                    },
                    {
                        "question": "5 + 4 = ?",
                        "options": [8, 9, 10],
                        "answer": 9,
                        "hint": "Start with 5 and count 4 more."
                    }
                ]
            },

            "hard": {
                "type": "complete",
                "instruction": "Solve the addition problem.",

                "questions": [
                    {
                        "question": "7 + 5 = ?",
                        "options": [11, 12, 13],
                        "answer": 12,
                        "hint": "Start with 7 and count 5 more."
                    },
                    {
                        "question": "8 + 6 = ?",
                        "options": [13, 14, 15],
                        "answer": 14,
                        "hint": "Start with 8 and count 6 more."
                    },
                    {
                        "question": "9 + 7 = ?",
                        "options": [15, 16, 17],
                        "answer": 16,
                        "hint": "Start with 9 and count 7 more."
                    }
                ]
            }
        }

        activity = activities[difficulty]

        return {
            "type": activity["type"],
            "topic": topic,
            "difficulty": difficulty,
            "interactive": True,
            "instruction": activity["instruction"],
            "questions": activity["questions"]
        }

    # -------------------------------------------------
    # Default activity for other subjects/topics
    # -------------------------------------------------

    return {
        "type": "choose_answer",
        "topic": topic,
        "difficulty": difficulty,
        "interactive": True,
        "instruction": "Choose the correct answer.",
        "questions": []
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
# 6. ADAPTIVE LEARNING
# ---------------------------------------------------------

def adapt_after_answer(is_correct, current_difficulty):
    """
    Decide what the student should receive after answering
    a practice question.

    M4 will eventually provide the assessment result.
    M3 decides the pedagogical response.
    """

    if is_correct:

        if current_difficulty == "easy":
            next_difficulty = "medium"

        elif current_difficulty == "medium":
            next_difficulty = "hard"

        else:
            next_difficulty = "hard"

        return {
            "result": "correct",
            "action": "continue",
            "next_difficulty": next_difficulty,
            "show_hint": False,
            "reinforcement_required": False
        }

    # ---------------------------------------------
    # Student answered incorrectly
    # ---------------------------------------------

    return {
        "result": "incorrect",
        "action": "give_hint",
        "next_difficulty": "easy",
        "show_hint": True,
        "reinforcement_required": True
    }
# ---------------------------------------------------------
# 7. MASTERY
# ---------------------------------------------------------

def calculate_mastery(correct_answers, total_questions):
    """
    Determine whether the student has mastered the topic.

    Mastery threshold:
    80% or above = Mastered
    60-79%       = Needs Practice
    Below 60%    = Struggling
    """

    if total_questions <= 0:
        return {
            "score": 0.0,
            "percentage": 0,
            "status": "invalid",
            "mastered": False
        }

    score = correct_answers / total_questions
    percentage = round(score * 100)

    if score >= 0.80:
        status = "mastered"
        mastered = True

    elif score >= 0.60:
        status = "needs_practice"
        mastered = False

    else:
        status = "struggling"
        mastered = False

    return {
        "score": round(score, 2),
        "percentage": percentage,
        "status": status,
        "mastered": mastered
    }
def decide_next_step(mastery_result):
    """
    Decide what the student should do after assessment.

    80% or above  -> Advance
    60-79%        -> Practice again
    Below 60%     -> Reinforcement
    """

    # M4 provides the mastery result.
    # M3 uses that result to decide the pedagogical response.
    status = mastery_result["status"]

    if status == "mastered":
        return {
            "action": "advance",
            "message": "Great job! You are ready for the next topic.",
            "reinforcement_required": False,
            "reassessment_required": False
        }

    elif status == "needs_practice":
        return {
            "action": "practice_again",
            "message": "Good effort! Let's practice this topic a little more.",
            "reinforcement_required": False,
            "reassessment_required": True
        }

    elif status == "struggling":
        return {
            "action": "reinforce",
            "message": "Let's learn this again using simple examples.",
            "reinforcement_required": True,
            "reassessment_required": True
        }

    return {
        "action": "invalid",
        "message": "Assessment result is not valid.",
        "reinforcement_required": False,
        "reassessment_required": False
    }
def build_learning_flow(
    class_level,
    subject,
    topic,
    student_level="beginner",
    previous_mastery=None,
    mastery_result=None
):
    """
    Build the complete pedagogical flow for a lesson.

    Connects:
    Lesson → Activity → Practice → Assessment
    → Mastery → Next Step → Reinforcement
    """

    # Generate the lesson
    lesson = generate_lesson(
        class_level,
        subject,
        topic,
        student_level,
        previous_mastery
    )

    # Determine current difficulty
    difficulty = select_difficulty(previous_mastery)

    # Decide what the student should do after assessment
    next_step = None
    next_topic = None

    if mastery_result is not None:
        next_step = decide_next_step(mastery_result)

        if next_step["action"] == "advance":
            next_topic = get_next_topic(subject, topic)

    # Prepare reinforcement
    # Prepare reinforcement only when the student needs it
    reinforcement = None

    if next_step is not None and next_step["reinforcement_required"]:
        reinforcement = get_reinforcement(subject, topic)

    return {
        "lesson": lesson,
        "difficulty": difficulty,
        "mastery": mastery_result,
        "next_step": next_step,
        "next_topic": next_topic,
        "reinforcement": reinforcement
    }
def get_next_topic(subject, topic):
    """
    Return the next topic in the learning sequence.
    """

    topic_progression = {
        ("Mathematics", "Addition up to 20"): "Addition Word Problems"
    }

    return topic_progression.get((subject, topic))
# ---------------------------------------------------------
# 8. REINFORCEMENT
# ---------------------------------------------------------

def get_reinforcement(subject, topic):
    """
    Recommend a simpler learning activity when a student
    is struggling with a concept.
    """

    if subject == "Mathematics":
        activity_type = "visual_counting"
        strategy = "Use objects and count them together."

    elif subject == "EVS":
        activity_type = "picture_matching"
        strategy = "Use pictures to connect the concept with familiar objects."

    elif subject == "Language":
        activity_type = "picture_vocabulary"
        strategy = "Use pictures and simple words to reinforce meaning."

    else:
        activity_type = "simple_visual_activity"
        strategy = "Use a simple visual example and guided practice."

    return {
        "enabled": True,
        "subject": subject,
        "topic": topic,
        "activity_type": activity_type,
        "difficulty": "easy",
        "strategy": strategy,
        "hint_enabled": True,
        "reassessment": True
    }
# ---------------------------------------------------------
# 9. COMPLETE LESSON
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
    # Basic end-to-end test for the Pedagogy Engine

    mastery_result = calculate_mastery(4, 5)

    flow = build_learning_flow(
        class_level=2,
        subject="Mathematics",
        topic="Addition up to 20",
        student_level="beginner",
        mastery_result=mastery_result
    )

    print("Pedagogy Engine Test")
    print("--------------------")
    print("Topic:", flow["lesson"]["topic"])
    print("Difficulty:", flow["difficulty"])
    print("Mastery:", flow["mastery"])
    print("Next Step:", flow["next_step"])
    print("Next Topic:", flow["next_topic"])
    print("Reinforcement:", flow["reinforcement"])