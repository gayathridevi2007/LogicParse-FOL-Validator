from typing import List, Optional
from app.parser.tokens import Token, TokenType
from app.parser.ast_nodes import ASTNode, QuantifierNode, BinaryOpNode, UnaryOpNode, PredicateNode
from app.parser.errors import ParseError, ErrorType, LogicSyntaxException

class Parser:
    def __init__(self, tokens: List[Token], original_text: str):
        self.tokens = tokens
        self.original_text = original_text
        self.cursor = 0

    @property
    def current(self) -> Token:
        if self.cursor < len(self.tokens):
            return self.tokens[self.cursor]
        return self.tokens[-1]

    def _peek(self, offset: int = 0) -> Token:
        idx = self.cursor + offset
        if idx < len(self.tokens):
            return self.tokens[idx]
        return self.tokens[-1]

    def _advance(self) -> Token:
        tok = self.current
        if self.cursor < len(self.tokens) - 1:
            self.cursor += 1
        return tok

    def _match(self, *types: TokenType) -> bool:
        if self.current.type in types:
            return True
        return False

    def _match_val(self, *values: str) -> bool:
        return self.current.value in values

    def parse(self) -> ASTNode:
        if not self.tokens or (len(self.tokens) == 1 and self.tokens[0].type == TokenType.EOF):
            raise LogicSyntaxException(ParseError(
                type=ErrorType.EMPTY_EXPRESSION,
                message="Expression is empty.",
                position=0,
                explanation="No First-Order Logic formula provided.",
                suggestion="Enter a First-Order Logic formula, e.g., '∀x (Student(x) → Learns(x))'."
            ))

        # Check preliminary parenthesis balance for immediate high-quality diagnostic
        self._check_parentheses_balance()

        root = self._parse_iff()

        if self.current.type != TokenType.EOF:
            # Trailing tokens
            if self.current.value == ")":
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.EXTRA_PARENTHESIS,
                    message="Extra unmatched closing parenthesis ')' found.",
                    position=self.current.position,
                    line=self.current.line,
                    column=self.current.column,
                    length=self.current.length,
                    explanation="There is a closing parenthesis without any preceding opening parenthesis.",
                    suggestion="Remove the extra ')' or add an opening '(' earlier in the expression."
                ))
            elif self.current.type == TokenType.OPERATOR:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Trailing operator '{self.current.value}' without right operand.",
                    position=self.current.position,
                    line=self.current.line,
                    column=self.current.column,
                    length=self.current.length,
                    explanation=f"The operator '{self.current.value}' requires a formula after it.",
                    suggestion=f"Provide a valid sub-expression or predicate after '{self.current.value}'."
                ))
            else:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERATOR,
                    message=f"Unexpected token '{self.current.value}' after expression.",
                    position=self.current.position,
                    line=self.current.line,
                    column=self.current.column,
                    length=self.current.length,
                    explanation="Two consecutive formulas or terms were found without a logical connective between them.",
                    suggestion="Insert a logical operator (∧, ∨, →, ↔) between the expressions."
                ))

        return root

    def _check_parentheses_balance(self):
        paren_stack = []
        for tok in self.tokens:
            if tok.type == TokenType.LPAREN:
                paren_stack.append(tok)
            elif tok.type == TokenType.RPAREN:
                if not paren_stack:
                    raise LogicSyntaxException(ParseError(
                        type=ErrorType.EXTRA_PARENTHESIS,
                        message="Unmatched closing parenthesis ')' found.",
                        position=tok.position,
                        line=tok.line,
                        column=tok.column,
                        length=tok.length,
                        explanation="A closing parenthesis exists without a matching opening parenthesis.",
                        suggestion="Remove the extra ')' or add a '(' before this term."
                    ))
                paren_stack.pop()

        if paren_stack:
            unmatched = paren_stack[-1]
            raise LogicSyntaxException(ParseError(
                type=ErrorType.MISSING_PARENTHESIS,
                message="Missing closing parenthesis ')' for opening parenthesis.",
                position=unmatched.position,
                line=unmatched.line,
                column=unmatched.column,
                length=unmatched.length,
                explanation=f"Parenthesis opened at position {unmatched.position} was never closed in the expression.",
                suggestion=f"Add a closing ')' at the end of the expression to balance the opening parenthesis from position {unmatched.position}."
            ))

    def _parse_iff(self) -> ASTNode:
        left = self._parse_implies()
        while self.current.type == TokenType.OPERATOR and self.current.value == "↔":
            op_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Missing right-hand operand for equivalence operator '{op_tok.value}'.",
                    position=op_tok.position,
                    explanation="The biconditional operator '↔' requires an expression on both sides.",
                    suggestion="Add a formula or predicate after '↔'."
                ))
            right = self._parse_implies()
            left = BinaryOpNode("↔", left, right, op_tok.position, op_tok.length)
        return left

    def _parse_implies(self) -> ASTNode:
        left = self._parse_or()
        if self.current.type == TokenType.OPERATOR and self.current.value == "→":
            op_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Missing right-hand operand for implication operator '{op_tok.value}'.",
                    position=op_tok.position,
                    explanation="The implication operator '→' requires a consequent formula on its right side.",
                    suggestion="Add a consequent formula after '→'."
                ))
            # Right associative: A → B → C == A → (B → C)
            right = self._parse_implies()
            return BinaryOpNode("→", left, right, op_tok.position, op_tok.length)
        return left

    def _parse_or(self) -> ASTNode:
        left = self._parse_and()
        while self.current.type == TokenType.OPERATOR and self.current.value == "∨":
            op_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Missing right-hand operand for disjunction operator '{op_tok.value}'.",
                    position=op_tok.position,
                    explanation="The OR operator '∨' connects two disjunct formulas.",
                    suggestion="Add a formula or predicate after '∨'."
                ))
            right = self._parse_and()
            left = BinaryOpNode("∨", left, right, op_tok.position, op_tok.length)
        return left

    def _parse_and(self) -> ASTNode:
        left = self._parse_unary()
        while self.current.type == TokenType.OPERATOR and self.current.value == "∧":
            op_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Missing right-hand operand for conjunction operator '{op_tok.value}'.",
                    position=op_tok.position,
                    explanation="The AND operator '∧' connects two conjunct formulas.",
                    suggestion="Add a formula or predicate after '∧'."
                ))
            right = self._parse_unary()
            left = BinaryOpNode("∧", left, right, op_tok.position, op_tok.length)
        return left

    def _parse_unary(self) -> ASTNode:
        # Check for consecutive operators e.g. ∧ ∧ or → ∧
        if self.current.type == TokenType.OPERATOR and self.current.value in ("∧", "∨", "→", "↔"):
            raise LogicSyntaxException(ParseError(
                type=ErrorType.CONSECUTIVE_OPERATORS,
                message=f"Unexpected binary operator '{self.current.value}' in prefix/operand position.",
                position=self.current.position,
                explanation=f"The operator '{self.current.value}' is a binary operator and requires a preceding expression.",
                suggestion=f"Remove '{self.current.value}' or provide an expression before it."
            ))

        # 1. Negation (¬)
        if self.current.type == TokenType.OPERATOR and self.current.value == "¬":
            op_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message="Missing formula after negation operator '¬'.",
                    position=op_tok.position,
                    explanation="The NOT operator '¬' requires a formula or predicate to negate.",
                    suggestion="Provide a predicate or parenthesized expression after '¬', e.g., '¬Student(x)'."
                ))
            operand = self._parse_unary()
            return UnaryOpNode("¬", operand, op_tok.position, op_tok.length)

        # 2. Quantifiers (∀, ∃)
        if self.current.type == TokenType.QUANTIFIER:
            q_tok = self._advance()
            if self.current.type not in (TokenType.VARIABLE, TokenType.PREDICATE):
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.INVALID_QUANTIFIER,
                    message=f"Quantifier '{q_tok.value}' must be immediately followed by a variable.",
                    position=self.current.position,
                    explanation=f"A quantifier must bind a variable (e.g. '{q_tok.value}x'), but found '{self.current.value or 'end of formula'}'.",
                    suggestion=f"Insert a variable name directly after the quantifier, e.g. '{q_tok.value}x'."
                ))
            var_tok = self._advance()
            if self.current.type == TokenType.EOF:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_OPERAND,
                    message=f"Quantified expression '{q_tok.value}{var_tok.value}' has no scope body.",
                    position=var_tok.position,
                    explanation=f"A quantifier scope must contain a valid formula, such as '{q_tok.value}{var_tok.value} Predicate({var_tok.value})'.",
                    suggestion=f"Add a predicate or parenthesized formula after '{q_tok.value}{var_tok.value}'."
                ))
            body = self._parse_unary()
            return QuantifierNode(q_tok.value, var_tok.value, body, q_tok.position, q_tok.length + var_tok.length)

        return self._parse_primary()

    def _parse_primary(self) -> ASTNode:
        # 1. Parenthesized formula
        if self.current.type == TokenType.LPAREN:
            l_paren = self._advance()
            inner = self._parse_iff()
            if self.current.type != TokenType.RPAREN:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MISSING_PARENTHESIS,
                    message="Missing closing parenthesis ')' matching '(' opened at position " + str(l_paren.position) + ".",
                    position=l_paren.position,
                    explanation="Parenthesis was opened but never closed before encountering unexpected token.",
                    suggestion="Add a closing ')' to properly close the sub-expression."
                ))
            self._advance() # consume RPAREN
            return inner

        # 2. Predicate
        if self.current.type == TokenType.PREDICATE or (self.current.type == TokenType.VARIABLE and self._peek(1).type == TokenType.LPAREN):
            pred_tok = self._advance()
            if self.current.type != TokenType.LPAREN:
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.INVALID_PREDICATE,
                    message=f"Predicate '{pred_tok.value}' must be followed by argument list in parentheses '()'.",
                    position=pred_tok.position,
                    explanation=f"In First-Order Logic, predicates must have arguments, e.g. '{pred_tok.value}(x)'.",
                    suggestion=f"Add arguments in parentheses, e.g., '{pred_tok.value}(x)'."
                ))
            self._advance() # consume LPAREN

            if self.current.type == TokenType.RPAREN:
                r_paren = self.current
                raise LogicSyntaxException(ParseError(
                    type=ErrorType.MALFORMED_ARGUMENTS,
                    message=f"Predicate '{pred_tok.value}' has empty arguments '()'.",
                    position=pred_tok.position,
                    explanation="Predicates in First-Order Logic cannot have zero arguments.",
                    suggestion=f"Provide at least one variable or constant, e.g., '{pred_tok.value}(x)'."
                ))

            args: List[str] = []
            while True:
                if self.current.type not in (TokenType.VARIABLE, TokenType.PREDICATE, TokenType.CONSTANT):
                    raise LogicSyntaxException(ParseError(
                        type=ErrorType.MALFORMED_ARGUMENTS,
                        message=f"Expected variable or constant argument in '{pred_tok.value}', got '{self.current.value}'.",
                        position=self.current.position,
                        explanation="Arguments within a predicate must be valid variable or constant identifiers separated by commas.",
                        suggestion=f"Use a valid identifier such as 'x' or 'john' inside '{pred_tok.value}(...)'."
                    ))
                arg_tok = self._advance()
                args.append(arg_tok.value)

                if self.current.type == TokenType.COMMA:
                    self._advance()
                    if self.current.type == TokenType.RPAREN:
                        raise LogicSyntaxException(ParseError(
                            type=ErrorType.MALFORMED_ARGUMENTS,
                            message=f"Trailing comma in arguments of predicate '{pred_tok.value}'.",
                            position=self.current.position,
                            explanation="Found a trailing comma without a subsequent argument term.",
                            suggestion="Remove the trailing comma or specify the next argument variable."
                        ))
                    continue
                elif self.current.type == TokenType.RPAREN:
                    self._advance()
                    break
                else:
                    raise LogicSyntaxException(ParseError(
                        type=ErrorType.MALFORMED_ARGUMENTS,
                        message=f"Unexpected token '{self.current.value}' in arguments of '{pred_tok.value}'. Expected ',' or ')'.",
                        position=self.current.position,
                        explanation=f"Arguments inside '{pred_tok.value}' must be separated by commas.",
                        suggestion="Add a comma ',' between arguments or close the predicate with ')'."
                    ))

            return PredicateNode(pred_tok.value, args, pred_tok.position, pred_tok.length)

        # 3. Standalone variable / term error
        if self.current.type == TokenType.VARIABLE:
            var_tok = self.current
            raise LogicSyntaxException(ParseError(
                type=ErrorType.INVALID_PREDICATE,
                message=f"Standalone term or variable '{var_tok.value}' is not a valid formula.",
                position=var_tok.position,
                explanation=f"In First-Order Logic, a formula must be constructed from predicates (like 'Student({var_tok.value})') or quantifiers.",
                suggestion=f"Wrap '{var_tok.value}' inside a predicate, e.g. 'P({var_tok.value})' or 'Student({var_tok.value})'."
            ))

        # 4. Extra closing parenthesis
        if self.current.type == TokenType.RPAREN:
            raise LogicSyntaxException(ParseError(
                type=ErrorType.EXTRA_PARENTHESIS,
                message="Unmatched closing parenthesis ')' found.",
                position=self.current.position,
                explanation="There is an extra closing parenthesis with no matching opening parenthesis.",
                suggestion="Remove the extra ')'."
            ))

        # 5. Fallback unexpected token
        raise LogicSyntaxException(ParseError(
            type=ErrorType.UNEXPECTED_TOKEN,
            message=f"Unexpected token '{self.current.value or 'end of expression'}' at position {self.current.position}.",
            position=self.current.position,
            explanation="The parser expected a predicate, quantifier (∀, ∃), negation (¬), or parenthesis '('.",
            suggestion="Check the formula structure and verify all symbols follow FOL grammar."
        ))
