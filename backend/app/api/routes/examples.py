from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/examples", tags=["Examples"])

class ExampleItem(BaseModel):
    id: str
    title: str
    expression: str
    category: str
    description: str
    is_valid: bool
    difficulty: str

SAMPLE_EXAMPLES = [
    ExampleItem(
        id="ex-1",
        title="Universal Implication",
        expression="∀x (Student(x) → Learns(x))",
        category="Universal Quantifiers",
        description="Every student learns. Standard implication with universal quantifier.",
        is_valid=True,
        difficulty="Beginner"
    ),
    ExampleItem(
        id="ex-2",
        title="Existential Conjunction",
        expression="∃x (Human(x) ∧ Smart(x))",
        category="Existential Quantifiers",
        description="There exists someone who is both human and smart.",
        is_valid=True,
        difficulty="Beginner"
    ),
    ExampleItem(
        id="ex-3",
        title="Binary Relation (Likes → Knows)",
        expression="∀x ∀y (Likes(x, y) → Knows(x, y))",
        category="Multi-Variable Relations",
        description="If x likes y, then x knows y for all individuals x and y.",
        is_valid=True,
        difficulty="Intermediate"
    ),
    ExampleItem(
        id="ex-4",
        title="Quantifier Duality Equivalence",
        expression="¬(∀x P(x)) ↔ ∃x ¬P(x)",
        category="Equivalences & Duality",
        description="De Morgan's law for quantifiers: Not all x have P is logically equivalent to there exists x without P.",
        is_valid=True,
        difficulty="Intermediate"
    ),
    ExampleItem(
        id="ex-5",
        title="Transitive Kinship Relation",
        expression="∀x ∀y ∀z ((Parent(x, y) ∧ Parent(y, z)) → Grandparent(x, z))",
        category="Complex Knowledge Base",
        description="Rule stating that a parent of a parent is a grandparent.",
        is_valid=True,
        difficulty="Advanced"
    ),
    ExampleItem(
        id="ex-6",
        title="Socrates Mortality Syllogism",
        expression="(∀x (Human(x) → Mortal(x))) ∧ Human(socrates) → Mortal(socrates)",
        category="Classical Syllogisms",
        description="All humans are mortal; Socrates is human; therefore Socrates is mortal.",
        is_valid=True,
        difficulty="Advanced"
    ),
    ExampleItem(
        id="err-1",
        title="Missing Closing Parenthesis (Syntax Error)",
        expression="∀x (Student(x) → Learns(x)",
        category="Syntax Error Demos",
        description="An opening parenthesis is never matched by a closing parenthesis.",
        is_valid=False,
        difficulty="Beginner"
    ),
    ExampleItem(
        id="err-2",
        title="Consecutive Binary Operators (Syntax Error)",
        expression="∀x (Student(x) ∧ ∧ Learns(x))",
        category="Syntax Error Demos",
        description="Two conjunction operators consecutively without an intervening predicate.",
        is_valid=False,
        difficulty="Beginner"
    ),
    ExampleItem(
        id="err-3",
        title="Empty Predicate Arguments (Syntax Error)",
        expression="∀x Student()",
        category="Syntax Error Demos",
        description="First-Order Logic predicates must contain at least one argument.",
        is_valid=False,
        difficulty="Beginner"
    ),
    ExampleItem(
        id="err-4",
        title="Quantifier Missing Variable (Syntax Error)",
        expression="∀ (Student(x) → Learns(x))",
        category="Syntax Error Demos",
        description="Quantifier ∀ must be followed immediately by a variable like 'x'.",
        is_valid=False,
        difficulty="Beginner"
    )
]

@router.get("", response_model=List[ExampleItem])
def get_examples():
    return SAMPLE_EXAMPLES
