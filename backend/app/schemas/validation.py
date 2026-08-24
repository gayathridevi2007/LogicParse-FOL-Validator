from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ValidationRequest(BaseModel):
    expression: str = Field(..., description="First-Order Logic expression to validate", min_length=1, max_length=1000)
    save_to_history: bool = Field(True, description="Whether to persist the validation attempt to SQLite database")

class TokenItem(BaseModel):
    type: str
    value: str
    raw_value: str
    position: int
    length: int
    line: int
    column: int
    sub_type: Optional[str] = None

class ErrorItem(BaseModel):
    type: str
    message: str
    position: int
    line: int
    column: int
    length: int
    explanation: str
    suggestion: str

class StatisticsItem(BaseModel):
    predicates: int = 0
    unique_predicates: Optional[int] = 0
    predicate_names: Optional[List[str]] = []
    variables: int = 0
    variable_names: Optional[List[str]] = []
    quantifiers: int = 0
    operators: int = 0
    parentheses: int = 0
    total_tokens: Optional[int] = 0

class PipelineStepItem(BaseModel):
    step: str
    name: str
    status: str
    detail: Optional[str] = None

class SemanticsItem(BaseModel):
    bound_variables: List[str] = []
    free_variables: List[str] = []
    is_sentence: bool = True
    sentence_type: str = "Closed Formula"

class ValidationResponse(BaseModel):
    valid: bool
    expression: str
    normalized_expression: Optional[str] = ""
    tokens: List[TokenItem] = []
    statistics: StatisticsItem
    errors: List[ErrorItem] = []
    parse_tree: Optional[Dict[str, Any]] = None
    pipeline_steps: List[PipelineStepItem] = []
    semantics: Optional[SemanticsItem] = None
    history_id: Optional[int] = None
