import pytest
from app.parser.lexer import Lexer
from app.parser.tokens import TokenType
from app.parser.errors import LogicSyntaxException, ErrorType

def test_tokenize_simple_predicate():
    lexer = Lexer("Student(x)")
    tokens = lexer.tokenize()
    assert len(tokens) == 5  # Student, (, x, ), EOF
    assert tokens[0].type == TokenType.PREDICATE
    assert tokens[0].value == "Student"
    assert tokens[1].type == TokenType.LPAREN
    assert tokens[2].type == TokenType.VARIABLE
    assert tokens[2].value == "x"
    assert tokens[3].type == TokenType.RPAREN
    assert tokens[4].type == TokenType.EOF

def test_tokenize_quantifiers_and_operators():
    lexer = Lexer("∀x (Student(x) → Learns(x))")
    tokens = lexer.tokenize()
    types = [t.type for t in tokens]
    assert types == [
        TokenType.QUANTIFIER, # ∀
        TokenType.VARIABLE,   # x
        TokenType.LPAREN,     # (
        TokenType.PREDICATE,  # Student
        TokenType.LPAREN,     # (
        TokenType.VARIABLE,   # x
        TokenType.RPAREN,     # )
        TokenType.OPERATOR,   # →
        TokenType.PREDICATE,  # Learns
        TokenType.LPAREN,     # (
        TokenType.VARIABLE,   # x
        TokenType.RPAREN,     # )
        TokenType.RPAREN,     # )
        TokenType.EOF
    ]

def test_tokenize_ascii_aliases():
    lexer = Lexer("forall x (Human(x) -> Smart(x))")
    tokens = lexer.tokenize()
    assert tokens[0].type == TokenType.QUANTIFIER
    assert tokens[0].value == "∀"
    assert tokens[0].raw_value == "forall"

    # Find the implication operator
    arrow_tok = [t for t in tokens if t.type == TokenType.OPERATOR and t.value == "→"][0]
    assert arrow_tok.raw_value == "->"

def test_tokenize_empty_raises_error():
    lexer = Lexer("   ")
    with pytest.raises(LogicSyntaxException) as exc:
        lexer.tokenize()
    assert exc.value.error.type == ErrorType.EMPTY_EXPRESSION

def test_tokenize_unexpected_character():
    lexer = Lexer("Student(x) @ Teacher(y)")
    with pytest.raises(LogicSyntaxException) as exc:
        lexer.tokenize()
    assert exc.value.error.type == ErrorType.UNEXPECTED_TOKEN
    assert "@" in exc.value.error.message
