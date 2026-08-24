from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict

class HistoryItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    expression: str
    normalized_expression: Optional[str]
    is_valid: bool
    token_count: int
    error_count: int
    error_summary: Optional[str]
    created_at: datetime

class HistoryDetailResponse(HistoryItemResponse):
    statistics: Optional[Dict[str, Any]]
    tokens: Optional[List[Dict[str, Any]]]
    parse_tree: Optional[Dict[str, Any]]
    errors: Optional[List[Dict[str, Any]]]
