from typing import Dict, Any, Optional

class ErrorType:
    EMPTY_EXPRESSION = "EMPTY_EXPRESSION"
    UNEXPECTED_TOKEN = "UNEXPECTED_TOKEN"
    MISSING_PARENTHESIS = "MISSING_PARENTHESIS"
    EXTRA_PARENTHESIS = "EXTRA_PARENTHESIS"
    INVALID_PREDICATE = "INVALID_PREDICATE"
    MALFORMED_ARGUMENTS = "MALFORMED_ARGUMENTS"
    MISSING_OPERAND = "MISSING_OPERAND"
    CONSECUTIVE_OPERATORS = "CONSECUTIVE_OPERATORS"
    MISSING_OPERATOR = "MISSING_OPERATOR"
    INVALID_QUANTIFIER = "INVALID_QUANTIFIER"
    UNBOUND_VARIABLE = "UNBOUND_VARIABLE"
    SYNTAX_ERROR = "SYNTAX_ERROR"

class ParseError:
    def __init__(
        self,
        type: str,
        message: str,
        position: int,
        line: int = 1,
        column: int = 1,
        length: int = 1,
        explanation: Optional[str] = None,
        suggestion: Optional[str] = None
    ):
        self.type = type
        self.message = message
        self.position = max(0, position)
        self.line = line
        self.column = column
        self.length = max(1, length)
        self.explanation = explanation or message
        self.suggestion = suggestion or "Check the syntax of the formula according to FOL grammar rules."

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "message": self.message,
            "position": self.position,
            "line": self.line,
            "column": self.column,
            "length": self.length,
            "explanation": self.explanation,
            "suggestion": self.suggestion
        }

    def __repr__(self) -> str:
        return f"ParseError({self.type}: {self.message} at pos {self.position})"

class LogicSyntaxException(Exception):
    def __init__(self, error: ParseError):
        super().__init__(error.message)
        self.error = error
