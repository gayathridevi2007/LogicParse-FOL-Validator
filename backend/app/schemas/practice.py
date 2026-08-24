from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class PracticeQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    difficulty: str
    category: str
    question: str
    options: List[str]
    expression_to_test: Optional[str] = None

class PracticeCheckRequest(BaseModel):
    question_id: int
    selected_option_index: int

class PracticeCheckResponse(BaseModel):
    is_correct: bool
    correct_option_index: int
    explanation: str
    validation_detail: Optional[dict] = None
