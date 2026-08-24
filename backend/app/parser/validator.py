from typing import Dict, Any, List, Set, Optional
from app.parser.tokens import Token, TokenType
from app.parser.lexer import Lexer
from app.parser.parser import Parser
from app.parser.ast_nodes import ASTNode, QuantifierNode, BinaryOpNode, UnaryOpNode, PredicateNode
from app.parser.errors import ParseError, ErrorType, LogicSyntaxException

class ValidationResult:
    def __init__(
        self,
        valid: bool,
        expression: str,
        normalized_expression: str,
        tokens: List[Dict[str, Any]],
        statistics: Dict[str, Any],
        errors: List[Dict[str, Any]],
        parse_tree: Optional[Dict[str, Any]],
        pipeline_steps: List[Dict[str, Any]],
        semantics: Optional[Dict[str, Any]] = None
    ):
        self.valid = valid
        self.expression = expression
        self.normalized_expression = normalized_expression
        self.tokens = tokens
        self.statistics = statistics
        self.errors = errors
        self.parse_tree = parse_tree
        self.pipeline_steps = pipeline_steps
        self.semantics = semantics or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "valid": self.valid,
            "expression": self.expression,
            "normalized_expression": self.normalized_expression,
            "tokens": self.tokens,
            "statistics": self.statistics,
            "errors": self.errors,
            "parse_tree": self.parse_tree,
            "pipeline_steps": self.pipeline_steps,
            "semantics": self.semantics
        }

class FOLValidator:
    def __init__(self):
        pass

    def validate(self, raw_expression: str) -> ValidationResult:
        pipeline_steps: List[Dict[str, Any]] = [
            {"step": "INPUT_RECEIVED", "name": "Input Received", "status": "completed", "detail": f"Length: {len(raw_expression)} characters"}
        ]
        tokens_list: List[Token] = []
        tokens_dict: List[Dict[str, Any]] = []
        errors: List[Dict[str, Any]] = []
        
        trimmed = raw_expression.strip() if raw_expression else ""
        if not trimmed:
            err = ParseError(
                type=ErrorType.EMPTY_EXPRESSION,
                message="Expression cannot be empty.",
                position=0,
                explanation="No formula was provided. Please enter a First-Order Logic formula.",
                suggestion="Type a formula like '∀x (Student(x) → Learns(x))' or pick an example."
            )
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression="",
                tokens=[],
                statistics={"predicates": 0, "variables": 0, "quantifiers": 0, "operators": 0, "parentheses": 0},
                errors=[err.to_dict()],
                parse_tree=None,
                pipeline_steps=[
                    {"step": "INPUT_RECEIVED", "name": "Input Received", "status": "error", "detail": "Empty input"}
                ]
            )

        # Step 1: Preprocessing
        pipeline_steps.append({
            "step": "PREPROCESSING",
            "name": "Input Preprocessing",
            "status": "completed",
            "detail": "Whitespace normalized and symbol set aligned"
        })

        # Step 2: Tokenization
        try:
            lexer = Lexer(raw_expression)
            tokens_list = lexer.tokenize()
            # Omit EOF token from visual token badges
            tokens_dict = [tok.to_dict() for tok in tokens_list if tok.type != TokenType.EOF]
            pipeline_steps.append({
                "step": "TOKENIZATION",
                "name": "Tokenization (Lexer)",
                "status": "completed",
                "detail": f"Generated {len(tokens_dict)} tokens"
            })
        except LogicSyntaxException as e:
            pipeline_steps.append({
                "step": "TOKENIZATION",
                "name": "Tokenization (Lexer)",
                "status": "error",
                "detail": f"Lexical error: {e.error.message}"
            })
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression="",
                tokens=tokens_dict,
                statistics={"predicates": 0, "variables": 0, "quantifiers": 0, "operators": 0, "parentheses": 0},
                errors=[e.error.to_dict()],
                parse_tree=None,
                pipeline_steps=pipeline_steps
            )
        except Exception as ex:
            err = ParseError(
                type=ErrorType.SYNTAX_ERROR,
                message=f"Lexer error: {str(ex)}",
                position=0
            )
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression="",
                tokens=tokens_dict,
                statistics={"predicates": 0, "variables": 0, "quantifiers": 0, "operators": 0, "parentheses": 0},
                errors=[err.to_dict()],
                parse_tree=None,
                pipeline_steps=pipeline_steps
            )

        # Step 3 & 4: Predicate & Syntax Parsing
        ast_root: Optional[ASTNode] = None
        try:
            parser = Parser(tokens_list, raw_expression)
            ast_root = parser.parse()
            pipeline_steps.append({
                "step": "PREDICATE_PARSING",
                "name": "Predicate & Term Parsing",
                "status": "completed",
                "detail": "Validated predicate structure and argument lists"
            })
            pipeline_steps.append({
                "step": "SYNTAX_VALIDATION",
                "name": "Syntax & Grammar Validation",
                "status": "completed",
                "detail": "AST constructed according to First-Order Logic grammar rules"
            })
        except LogicSyntaxException as e:
            pipeline_steps.append({
                "step": "SYNTAX_VALIDATION",
                "name": "Syntax & Grammar Validation",
                "status": "error",
                "detail": f"Parse error: {e.error.message}"
            })
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression=" ".join(t.value for t in tokens_list if t.type != TokenType.EOF),
                tokens=tokens_dict,
                statistics=self._collect_token_stats(tokens_list),
                errors=[e.error.to_dict()],
                parse_tree=None,
                pipeline_steps=pipeline_steps
            )
        except Exception as ex:
            err = ParseError(
                type=ErrorType.SYNTAX_ERROR,
                message=f"Syntax analysis failed: {str(ex)}",
                position=0
            )
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression=" ".join(t.value for t in tokens_list if t.type != TokenType.EOF),
                tokens=tokens_dict,
                statistics=self._collect_token_stats(tokens_list),
                errors=[err.to_dict()],
                parse_tree=None,
                pipeline_steps=pipeline_steps
            )

        # Step 5: Semantic and Statistical Analysis
        stats = self._collect_ast_stats(ast_root, tokens_list)
        semantics = self._analyze_semantics(ast_root)
        
        # Check predicate arity consistency across formula
        arity_errors = self._check_predicate_arities(ast_root)
        if arity_errors:
            errors.extend([err.to_dict() for err in arity_errors])
            pipeline_steps.append({
                "step": "SEMANTIC_VALIDATION",
                "name": "Semantic Arity Validation",
                "status": "error",
                "detail": f"Inconsistent predicate arity detected"
            })
            return ValidationResult(
                valid=False,
                expression=raw_expression,
                normalized_expression=" ".join(t.value for t in tokens_list if t.type != TokenType.EOF),
                tokens=tokens_dict,
                statistics=stats,
                errors=errors,
                parse_tree=ast_root.to_dict() if ast_root else None,
                pipeline_steps=pipeline_steps,
                semantics=semantics
            )

        pipeline_steps.append({
            "step": "RESULT_GENERATED",
            "name": "Validation Success",
            "status": "completed",
            "detail": "Formula is syntactically valid First-Order Logic"
        })

        return ValidationResult(
            valid=True,
            expression=raw_expression,
            normalized_expression=" ".join(t.value for t in tokens_list if t.type != TokenType.EOF),
            tokens=tokens_dict,
            statistics=stats,
            errors=[],
            parse_tree=ast_root.to_dict(),
            pipeline_steps=pipeline_steps,
            semantics=semantics
        )

    def _collect_token_stats(self, tokens: List[Token]) -> Dict[str, Any]:
        predicates = sum(1 for t in tokens if t.type == TokenType.PREDICATE)
        variables = sum(1 for t in tokens if t.type == TokenType.VARIABLE)
        quantifiers = sum(1 for t in tokens if t.type == TokenType.QUANTIFIER)
        operators = sum(1 for t in tokens if t.type == TokenType.OPERATOR)
        parentheses = sum(1 for t in tokens if t.type in (TokenType.LPAREN, TokenType.RPAREN))

        return {
            "predicates": predicates,
            "variables": variables,
            "quantifiers": quantifiers,
            "operators": operators,
            "parentheses": parentheses,
            "total_tokens": len([t for t in tokens if t.type != TokenType.EOF])
        }

    def _collect_ast_stats(self, root: ASTNode, tokens: List[Token]) -> Dict[str, Any]:
        predicates_set = set()
        variables_set = set()
        quantifiers_count = 0
        operators_count = 0
        predicates_count = 0

        def traverse(node: ASTNode):
            nonlocal quantifiers_count, operators_count, predicates_count
            if isinstance(node, QuantifierNode):
                quantifiers_count += 1
                variables_set.add(node.variable)
                if node.body:
                    traverse(node.body)
            elif isinstance(node, BinaryOpNode):
                operators_count += 1
                traverse(node.left)
                traverse(node.right)
            elif isinstance(node, UnaryOpNode):
                operators_count += 1
                if node.operand:
                    traverse(node.operand)
            elif isinstance(node, PredicateNode):
                predicates_count += 1
                predicates_set.add(node.name)
                for arg in node.arguments:
                    variables_set.add(arg)

        traverse(root)

        parentheses_count = sum(1 for t in tokens if t.type in (TokenType.LPAREN, TokenType.RPAREN))

        return {
            "predicates": predicates_count,
            "unique_predicates": len(predicates_set),
            "predicate_names": sorted(list(predicates_set)),
            "variables": len(variables_set),
            "variable_names": sorted(list(variables_set)),
            "quantifiers": quantifiers_count,
            "operators": operators_count,
            "parentheses": parentheses_count,
            "total_tokens": len([t for t in tokens if t.type != TokenType.EOF])
        }

    def _analyze_semantics(self, root: ASTNode) -> Dict[str, Any]:
        bound_vars: Set[str] = set()
        free_vars: Set[str] = set()
        all_terms: Set[str] = set()

        def analyze(node: ASTNode, active_quantifiers: Set[str]):
            if isinstance(node, QuantifierNode):
                bound_vars.add(node.variable)
                new_active = active_quantifiers | {node.variable}
                if node.body:
                    analyze(node.body, new_active)
            elif isinstance(node, BinaryOpNode):
                analyze(node.left, active_quantifiers)
                analyze(node.right, active_quantifiers)
            elif isinstance(node, UnaryOpNode):
                if node.operand:
                    analyze(node.operand, active_quantifiers)
            elif isinstance(node, PredicateNode):
                for arg in node.arguments:
                    all_terms.add(arg)
                    if arg not in active_quantifiers:
                        free_vars.add(arg)

        analyze(root, set())

        return {
            "bound_variables": sorted(list(bound_vars)),
            "free_variables": sorted(list(free_vars)),
            "is_sentence": len(free_vars) == 0,
            "sentence_type": "Closed Formula (Sentence)" if len(free_vars) == 0 else "Open Formula (Contains Free Variables)"
        }

    def _check_predicate_arities(self, root: ASTNode) -> List[ParseError]:
        arity_map: Dict[str, int] = {}
        errors: List[ParseError] = []

        def check(node: ASTNode):
            if isinstance(node, QuantifierNode):
                if node.body:
                    check(node.body)
            elif isinstance(node, BinaryOpNode):
                check(node.left)
                check(node.right)
            elif isinstance(node, UnaryOpNode):
                if node.operand:
                    check(node.operand)
            elif isinstance(node, PredicateNode):
                curr_arity = len(node.arguments)
                if node.name in arity_map:
                    prev_arity = arity_map[node.name]
                    if prev_arity != curr_arity:
                        errors.append(ParseError(
                            type=ErrorType.INVALID_PREDICATE,
                            message=f"Inconsistent arity for predicate '{node.name}'. Previously used with {prev_arity} arguments, but here used with {curr_arity}.",
                            position=node.position,
                            explanation=f"In First-Order Logic, each predicate symbol has a fixed arity (number of arguments). '{node.name}' cannot have both {prev_arity} and {curr_arity} arguments.",
                            suggestion=f"Make the number of arguments for '{node.name}' consistent across the entire formula."
                        ))
                else:
                    arity_map[node.name] = curr_arity

        check(root)
        return errors
