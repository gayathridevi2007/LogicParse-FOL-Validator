import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import ValidationHistory
from app.schemas.validation import ValidationRequest, ValidationResponse
from app.parser.validator import FOLValidator

router = APIRouter(prefix="/api", tags=["Validator"])
validator_engine = FOLValidator()

@router.post("/validate", response_model=ValidationResponse)
def validate_expression(payload: ValidationRequest, db: Session = Depends(get_db)):
    result = validator_engine.validate(payload.expression)
    result_dict = result.to_dict()

    history_id = None
    if payload.save_to_history:
        try:
            error_summary = result_dict["errors"][0]["message"] if result_dict["errors"] else None
            history_record = ValidationHistory(
                expression=payload.expression,
                normalized_expression=result_dict.get("normalized_expression"),
                is_valid=result_dict["valid"],
                token_count=len(result_dict.get("tokens", [])),
                error_count=len(result_dict.get("errors", [])),
                error_summary=error_summary,
                statistics_json=json.dumps(result_dict.get("statistics", {})),
                tokens_json=json.dumps(result_dict.get("tokens", [])),
                parse_tree_json=json.dumps(result_dict.get("parse_tree")) if result_dict.get("parse_tree") else None,
                errors_json=json.dumps(result_dict.get("errors", []))
            )
            db.add(history_record)
            db.commit()
            db.refresh(history_record)
            history_id = history_record.id
        except Exception as e:
            db.rollback()
            # Non-fatal if DB insert fails
            pass

    result_dict["history_id"] = history_id
    return result_dict
