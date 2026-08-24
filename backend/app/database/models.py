from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from app.database.session import Base

class ValidationHistory(Base):
    __tablename__ = "validation_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    expression = Column(String(500), nullable=False, index=True)
    normalized_expression = Column(String(500), nullable=True)
    is_valid = Column(Boolean, nullable=False, index=True)
    token_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    error_summary = Column(String(500), nullable=True)
    statistics_json = Column(Text, nullable=True)
    tokens_json = Column(Text, nullable=True)
    parse_tree_json = Column(Text, nullable=True)
    errors_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class ExampleExpression(Base):
    __tablename__ = "examples"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    expression = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    is_valid = Column(Boolean, default=True)

class PracticeQuestion(Base):
    __tablename__ = "practice_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    difficulty = Column(String(20), nullable=False, index=True) # Beginner, Intermediate, Advanced
    category = Column(String(50), nullable=False)
    question = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False) # JSON array of string options
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    expression_to_test = Column(String(500), nullable=True)
