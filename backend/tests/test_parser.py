import pytest
from app.parser.lexer import Lexer
from app.parser.parser import Parser
from app.parser.ast_nodes import QuantifierNode, BinaryOpNode, UnaryOpNode, PredicateNode
from app.parser.errors import LogicSyntaxException, ErrorType

def parse_expr(text: str):
    lexer = Lexer(text)
    tokens = lexer.tokenize()
    parser = Parser(tokens, text)
    return parser.parse()

def test_parse_valid_predicate():
    ast = parse_expr("Likes(x, y)")
    assert isinstance(ast, PredicateNode)
    assert ast.name == "Likes"
    assert ast.arguments == ["x", "y"]

def test_parse_quantifier():
    ast = parse_expr("∀x Student(x)")
    assert isinstance(ast, QuantifierNode)
    assert ast.quantifier == "∀"
    assert ast.variable == "x"
    assert isinstance(ast.body, PredicateNode)

def test_parse_nested_quantifiers():
    ast = parse_expr("∀x ∃y (Likes(x, y) ∧ Knows(x, y))")
    assert isinstance(ast, QuantifierNode)
    assert ast.quantifier == "∀"
    assert isinstance(ast.body, QuantifierNode)
    assert ast.body.quantifier == "∃"
    assert isinstance(ast.body.body, BinaryOpNode)
    assert ast.body.body.operator == "∧"

def test_parse_implication_and_disjunction():
    ast = parse_expr("Student(x) ∨ Teacher(x) → Person(x)")
    assert isinstance(ast, BinaryOpNode)
    assert ast.operator == "→"
    assert isinstance(ast.left, BinaryOpNode)
    assert ast.left.operator == "∨"
    assert isinstance(ast.right, PredicateNode)

def test_parse_missing_closing_parenthesis():
    with pytest.raises(LogicSyntaxException) as exc:
        parse_expr("∀x (Student(x) → Learns(x)")
    assert exc.value.error.type == ErrorType.MISSING_PARENTHESIS

def test_parse_extra_closing_parenthesis():
    with pytest.raises(LogicSyntaxException) as exc:
        parse_expr("Student(x))")
    assert exc.value.error.type == ErrorType.EXTRA_PARENTHESIS

def test_parse_consecutive_operators():
    with pytest.raises(LogicSyntaxException) as exc:
        parse_expr("Student(x) ∧ ∧ Teacher(x)")
    assert exc.value.error.type == ErrorType.CONSECUTIVE_OPERATORS

def test_parse_empty_predicate_args():
    with pytest.raises(LogicSyntaxException) as exc:
        parse_expr("Student()")
    assert exc.value.error.type == ErrorType.MALFORMED_ARGUMENTS
