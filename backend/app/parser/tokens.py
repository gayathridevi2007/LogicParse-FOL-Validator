from enum import Enum
from typing import Optional, Dict, Any

class TokenType(str, Enum):
    QUANTIFIER = "QUANTIFIER"       # ∀, ∃
    PREDICATE = "PREDICATE"         # Student, Likes, Human
    VARIABLE = "VARIABLE"           # x, y, z
    CONSTANT = "CONSTANT"           # john, mary, a, b
    OPERATOR = "OPERATOR"           # ¬, ∧, ∨, →, ↔
    LPAREN = "LPAREN"               # (
    RPAREN = "RPAREN"               # )
    COMMA = "COMMA"                 # ,
    EOF = "EOF"
    UNKNOWN = "UNKNOWN"

class Token:
    def __init__(
        self,
        type: TokenType,
        value: str,
        raw_value: str,
        position: int,
        length: int,
        line: int = 1,
        column: int = 1,
        sub_type: Optional[str] = None
    ):
        self.type = type
        self.value = value
        self.raw_value = raw_value
        self.position = position
        self.length = length
        self.line = line
        self.column = column
        self.sub_type = sub_type or type.value

    def to_dict(self) -> Dict[str, Any]:
        display_type = "PARENTHESIS" if self.type in (TokenType.LPAREN, TokenType.RPAREN) else self.type.value
        return {
            "type": display_type,
            "raw_type": self.type.value,
            "value": self.value,
            "raw_value": self.raw_value,
            "position": self.position,
            "length": self.length,
            "line": self.line,
            "column": self.column,
            "sub_type": self.sub_type
        }

    def __repr__(self) -> str:
        return f"Token({self.type.value}, '{self.value}', pos={self.position})"
