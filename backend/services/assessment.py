"""
M4 - Assessment + Learning Gaps
Core business logic (kept separate from routes so routes stay thin).

Everything here is deterministic / rule-based on purpose (per the MVP
requirements) - no AI/LLM calls, no external services.
"""

import json


# ---------- Configurable thresholds ----------
# Kept as simple ordered lists (highest cutoff first) so they're easy
# to tweak later without touching the logic that uses them.

MASTERY_THRESHOLDS = [
    (90, "Mastered"),
    (75, "Proficient"),
    (50, "Developing"),
    (0, "Needs Reinforcement"),
]

GAP_SEVERITY_THRESHOLDS = [
    (80, "No significant gap"),
    (60, "Mild"),
    (40, "Moderate"),
    (0, "Major"),
]

# Generic, rule-based reinforcement suggestions per gap severity.
# (Deliberately generic/deterministic - no AI model needed for MVP.)
REINFORCEMENT_BY_SEVERITY = {
    "Major": [
        "Re-teach the concept with a simpler explanation",
        "Use a visual/hands-on activity",
        "Give easier practice questions",
        "Retry assessment after practice",
    ],
    "Moderate": [
        "Show one worked example again",
        "Give a few easier practice questions",
        "Retry the weak skill's questions",
    ],
    "Mild": [
        "Give a couple of extra practice questions",
        "Move on, but revisit this skill briefly next lesson",
    ],
    "No significant gap": [
        "No reinforcement needed - continue to the next topic",
    ],
}


# ---------- Answer normalization ----------

def normalize_answer(question_type: str, raw_answer: str) -> str:
    """
    Turn a raw answer into a consistent form so that things like
    "4" vs "04", or "a" vs "A", are treated as equal.
    """
    if raw_answer is None:
        return ""

    answer = raw_answer.strip()

    if question_type == "numeric":
        # "04" -> "4", " 4 " -> "4". Falls back to plain stripped
        # string if it isn't actually a number.
        try:
            return str(int(answer))
        except ValueError:
            return answer.lower()

    if question_type == "mcq":
        return answer.strip().upper()

    if question_type == "true_false":
        answer_lower = answer.lower()
        if answer_lower in ("true", "t", "yes"):
            return "true"
        if answer_lower in ("false", "f", "no"):
            return "false"
        return answer_lower

    if question_type == "text":
        # collapse internal whitespace, trim, lowercase
        return " ".join(answer.split()).lower()

    # unknown type - just strip and lowercase as a safe default
    return answer.lower()


def is_answer_correct(question, given_answer: str) -> bool:
    """question is a models.Question row."""
    normalized_given = normalize_answer(question.question_type, given_answer)
    normalized_correct = normalize_answer(question.question_type, question.correct_answer)
    return normalized_given == normalized_correct


# ---------- Mastery ----------

def get_mastery_status(percentage: float) -> str:
    for cutoff, label in MASTERY_THRESHOLDS:
        if percentage >= cutoff:
            return label
    return MASTERY_THRESHOLDS[-1][1]  # fallback, shouldn't normally hit this


def get_gap_severity(percentage: float) -> str:
    for cutoff, label in GAP_SEVERITY_THRESHOLDS:
        if percentage >= cutoff:
            return label
    return GAP_SEVERITY_THRESHOLDS[-1][1]


# ---------- Scoring / skill performance ----------

def calculate_skill_performance(question_results: list[dict]) -> dict:
    """
    question_results: list of dicts like:
        {"skill": "Counting", "is_correct": True}
    (skill may be None if a question has no skill tagged - grouped as "General")

    Returns a dict like:
        {"Counting": {"correct": 4, "total": 4, "percentage": 100.0}, ...}
    """
    skill_totals = {}

    for result in question_results:
        skill_name = result["skill"] or "General"
        if skill_name not in skill_totals:
            skill_totals[skill_name] = {"correct": 0, "total": 0}

        skill_totals[skill_name]["total"] += 1
        if result["is_correct"]:
            skill_totals[skill_name]["correct"] += 1

    skill_performance = {}
    for skill_name, counts in skill_totals.items():
        percentage = (counts["correct"] / counts["total"]) * 100 if counts["total"] else 0.0
        skill_performance[skill_name] = {
            "correct": counts["correct"],
            "total": counts["total"],
            "percentage": round(percentage, 1),
        }

    return skill_performance


def identify_learning_gaps(skill_performance: dict) -> list[dict]:
    """
    Only skills below "No significant gap" are returned as actual gaps
    (so a skill the student is doing fine in isn't reported as a "gap").
    """
    gaps = []
    for skill_name, perf in skill_performance.items():
        severity = get_gap_severity(perf["percentage"])
        if severity != "No significant gap":
            gaps.append({
                "skill": skill_name,
                "percentage": perf["percentage"],
                "severity": severity,
            })
    return gaps


def recommend_reinforcement(learning_gaps: list[dict]) -> list[str]:
    """
    Rule-based only (no AI model), per MVP requirements.
    If there are multiple gaps, we base the recommendation on the
    single worst (most severe) gap, since that's what the child most
    needs help with next.
    """
    if not learning_gaps:
        return REINFORCEMENT_BY_SEVERITY["No significant gap"]

    severity_order = ["Major", "Moderate", "Mild"]
    worst_gap = min(
        learning_gaps,
        key=lambda gap: severity_order.index(gap["severity"])
        if gap["severity"] in severity_order else len(severity_order),
    )
    return REINFORCEMENT_BY_SEVERITY.get(worst_gap["severity"], [])


# ---------- JSON helpers (for storing computed results as text columns) ----------

def to_json(data) -> str:
    return json.dumps(data)


def from_json(text: str):
    if not text:
        return None
    return json.loads(text)
