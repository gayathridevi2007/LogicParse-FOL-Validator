import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.database.models import ValidationHistory
from app.schemas.history import HistoryItemResponse, HistoryDetailResponse

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("", response_model=List[HistoryItemResponse])
def get_history(
    limit: int = Query(50, ge=1, le=200),
    filter_valid: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ValidationHistory)
    if filter_valid is not None:
        query = query.filter(ValidationHistory.is_valid == filter_valid)
    records = query.order_by(desc(ValidationHistory.created_at)).limit(limit).all()
    return records

@router.get("/{history_id}", response_model=HistoryDetailResponse)
def get_history_detail(history_id: int, db: Session = Depends(get_db)):
    record = db.query(ValidationHistory).filter(ValidationHistory.id == history_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Validation history item not found")
    
    return {
        "id": record.id,
        "expression": record.expression,
        "normalized_expression": record.normalized_expression,
        "is_valid": record.is_valid,
        "token_count": record.token_count,
        "error_count": record.error_count,
        "error_summary": record.error_summary,
        "created_at": record.created_at,
        "statistics": json.loads(record.statistics_json) if record.statistics_json else {},
        "tokens": json.loads(record.tokens_json) if record.tokens_json else [],
        "parse_tree": json.loads(record.parse_tree_json) if record.parse_tree_json else None,
        "errors": json.loads(record.errors_json) if record.errors_json else []
    }

@router.delete("/{history_id}")
def delete_history_item(history_id: int, db: Session = Depends(get_db)):
    record = db.query(ValidationHistory).filter(ValidationHistory.id == history_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Validation history item not found")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"History item {history_id} deleted successfully"}

@router.delete("")
def clear_all_history(db: Session = Depends(get_db)):
    count = db.query(ValidationHistory).delete()
    db.commit()
    return {"status": "success", "message": f"Cleared {count} history records"}
