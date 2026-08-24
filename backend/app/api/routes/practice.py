from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.practice import PracticeQuestionResponse, PracticeCheckRequest, PracticeCheckResponse
from app.parser.validator import FOLValidator

router = APIRouter(prefix="/api/practice", tags=["Practice"])
validator_engine = FOLValidator()

PRACTICE_QUESTIONS = [
    {
        "id": 1,
        "difficulty": "Beginner",
        "category": "Quantifiers & Predicates",
        "question": "Which of the following expressions is syntactically valid in First-Order Logic?",
        "options": [
            "∀x Student(x)",
            "∀ (x Student(x)",
            "Student( )",
            "∧ Student(x)"
        ],
        "correct_option_index": 0,
        "explanation": "∀x Student(x) correctly pairs the universal quantifier ∀ with the variable x, followed by a valid predicate Student(x) with argument x."
    },
    {
        "id": 2,
        "difficulty": "Beginner",
        "category": "Parentheses & Arity",
        "question": "Why is the expression '∀x (Human(x) → Mortal(x)' invalid?",
        "options": [
            "Implication operator '→' cannot be used with quantifiers",
            "Missing closing parenthesis ')' to balance the '(' after ∀x",
            "Predicate names must be lowercase",
            "The variable 'x' is undefined"
        ],
        "correct_option_index": 1,
        "explanation": "Parentheses must be strictly balanced in First-Order Logic. The '(' opened after the quantifier was never closed."
    },
    {
        "id": 3,
        "difficulty": "Intermediate",
        "category": "Binary Connectives",
        "question": "Which formula correctly represents: 'Every student likes some teacher'?",
        "options": [
            "∀x ∃y (Student(x) ∧ Teacher(y) ∧ Likes(x, y))",
            "∀x (Student(x) → ∃y (Teacher(y) ∧ Likes(x, y)))",
            "∃y (Teacher(y) → ∀x (Student(x) ∧ Likes(x, y)))",
            "∀x ∀y (Student(x) → (Teacher(y) → Likes(x, y)))"
        ],
        "correct_option_index": 1,
        "explanation": "Standard FOL translation uses implication with universal quantification (for all x, IF x is a student...) and conjunction with existential quantification (there exists y such that y is a teacher AND x likes y)."
    },
    {
        "id": 4,
        "difficulty": "Intermediate",
        "category": "Syntax Rules",
        "question": "What syntax error occurs in: '∀x (P(x) ∧ ∧ Q(x))'?",
        "options": [
            "Invalid variable identifier",
            "Consecutive binary operators without an operand between them",
            "Missing quantifier for Q(x)",
            "Unbalanced brackets"
        ],
        "correct_option_index": 1,
        "explanation": "A binary operator like '∧' requires an operand expression on both sides. Having two consecutive '∧ ∧' is invalid syntax."
    },
    {
        "id": 5,
        "difficulty": "Advanced",
        "category": "Logical Equivalence & Duality",
        "question": "According to Quantifier Negation (De Morgan's Duality), ¬(∀x P(x)) is logically equivalent to which formula?",
        "options": [
            "∀x ¬P(x)",
            "∃x ¬P(x)",
            "¬(∃x ¬P(x))",
            "∃x P(x)"
        ],
        "correct_option_index": 1,
        "explanation": "Negating a universal statement ('It is not the case that everyone satisfies P') is equivalent to an existential statement ('There exists at least one person who does not satisfy P' -> ∃x ¬P(x))."
    },
    {
        "id": 6,
        "difficulty": "Advanced",
        "category": "Multi-Variable Relations",
        "question": "Which formula is valid and expresses: 'Transitivity of Relation R'?",
        "options": [
            "∀x ∀y ∀z ((R(x, y) ∧ R(y, z)) → R(x, z))",
            "∀x ∀y (R(x, y) → R(y, x))",
            "∀x R(x, x)",
            "∃x ∃y ∃z (R(x, y) ∨ R(y, z) ↔ R(x, z))"
        ],
        "correct_option_index": 0,
        "explanation": "Transitivity means whenever R(x,y) and R(y,z) hold, R(x,z) must also hold for all x, y, z."
    }
]

@router.get("/questions", response_model=List[PracticeQuestionResponse])
def get_practice_questions():
    return [
        {
            "id": q["id"],
            "difficulty": q["difficulty"],
            "category": q["category"],
            "question": q["question"],
            "options": q["options"],
            "expression_to_test": q.get("expression_to_test")
        }
        for q in PRACTICE_QUESTIONS
    ]

@router.post("/check", response_model=PracticeCheckResponse)
def check_practice_answer(payload: PracticeCheckRequest):
    question = next((q for q in PRACTICE_QUESTIONS if q["id"] == payload.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = (payload.selected_option_index == question["correct_option_index"])
    selected_text = question["options"][payload.selected_option_index] if 0 <= payload.selected_option_index < len(question["options"]) else ""

    # Test through real parser engine if the option looks like a formula
    validation_detail = None
    if any(sym in selected_text for sym in ("∀", "∃", "(", ")", "→", "∧")):
        try:
            val_res = validator_engine.validate(selected_text)
            validation_detail = {
                "valid": val_res.valid,
                "token_count": len(val_res.tokens),
                "error": val_res.errors[0]["message"] if val_res.errors else None
            }
        except Exception:
            pass

    return {
        "is_correct": is_correct,
        "correct_option_index": question["correct_option_index"],
        "explanation": question["explanation"],
        "validation_detail": validation_detail
    }
