import re
from typing import List
from app.parser.tokens import Token, TokenType
from app.parser.errors import ParseError, ErrorType, LogicSyntaxException

class Lexer:
    def __init__(self, text: str):
        self.raw_text = text
        self.length = len(text)
        self.cursor = 0
        self.line = 1
        self.column = 1

    def _peek(self, offset: int = 0) -> str:
        idx = self.cursor + offset
        if idx < self.length:
            return self.raw_text[idx]
        return ""

    def _advance(self, count: int = 1) -> str:
        sub = self.raw_text[self.cursor:self.cursor + count]
        for ch in sub:
            if ch == "\n":
                self.line += 1
                self.column = 1
            else:
                self.column += 1
        self.cursor += count
        return sub

    def _skip_whitespace(self):
        while self.cursor < self.length and self.raw_text[self.cursor].isspace():
            self._advance()

    def tokenize(self) -> List[Token]:
        tokens: List[Token] = []
        
        if not self.raw_text or not self.raw_text.strip():
            raise LogicSyntaxException(ParseError(
                type=ErrorType.EMPTY_EXPRESSION,
                message="The expression cannot be empty.",
                position=0,
                line=1,
                column=1,
                length=0,
                explanation="No First-Order Logic formula was provided to validate.",
                suggestion="Enter a First-Order Logic formula such as '∀x (Student(x) → Learns(x))'."
            ))

        while self.cursor < self.length:
            self._skip_whitespace()
            if self.cursor >= self.length:
                break

            start_pos = self.cursor
            start_line = self.line
            start_col = self.column
            ch = self.raw_text[self.cursor]

            # 1. Parentheses and Brackets
            if ch in ("(", "["):
                self._advance()
                tokens.append(Token(
                    type=TokenType.LPAREN,
                    value="(",
                    raw_value=ch,
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col
                ))
                continue

            if ch in (")", "]"):
                self._advance()
                tokens.append(Token(
                    type=TokenType.RPAREN,
                    value=")",
                    raw_value=ch,
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col
                ))
                continue

            # 2. Comma
            if ch == ",":
                self._advance()
                tokens.append(Token(
                    type=TokenType.COMMA,
                    value=",",
                    raw_value=",",
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col
                ))
                continue

            # 3. Unicode Quantifiers
            if ch == "∀":
                self._advance()
                tokens.append(Token(
                    type=TokenType.QUANTIFIER,
                    value="∀",
                    raw_value="∀",
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="UNIVERSAL"
                ))
                continue

            if ch == "∃":
                self._advance()
                tokens.append(Token(
                    type=TokenType.QUANTIFIER,
                    value="∃",
                    raw_value="∃",
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="EXISTENTIAL"
                ))
                continue

            # 4. Multi-character operators (<->, <=>, ->, =>, &&, ||)
            if self.raw_text.startswith(("<->", "<=>"), self.cursor):
                raw = self._advance(3)
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="↔",
                    raw_value=raw,
                    position=start_pos,
                    length=3,
                    line=start_line,
                    column=start_col,
                    sub_type="EQUIVALENCE"
                ))
                continue

            if self.raw_text.startswith(("->", "=>"), self.cursor):
                raw = self._advance(2)
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="→",
                    raw_value=raw,
                    position=start_pos,
                    length=2,
                    line=start_line,
                    column=start_col,
                    sub_type="IMPLICATION"
                ))
                continue

            if self.raw_text.startswith("&&", self.cursor):
                raw = self._advance(2)
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="∧",
                    raw_value=raw,
                    position=start_pos,
                    length=2,
                    line=start_line,
                    column=start_col,
                    sub_type="CONJUNCTION"
                ))
                continue

            if self.raw_text.startswith("||", self.cursor):
                raw = self._advance(2)
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="∨",
                    raw_value=raw,
                    position=start_pos,
                    length=2,
                    line=start_line,
                    column=start_col,
                    sub_type="DISJUNCTION"
                ))
                continue

            # 5. Single-character operators (Unicode and ASCII)
            if ch in ("¬", "!", "~"):
                self._advance()
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="¬",
                    raw_value=ch,
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="NEGATION"
                ))
                continue

            if ch in ("∧", "&"):
                self._advance()
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="∧",
                    raw_value=ch,
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="CONJUNCTION"
                ))
                continue

            if ch in ("∨", "|"):
                self._advance()
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="∨",
                    raw_value=ch,
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="DISJUNCTION"
                ))
                continue

            if ch == "→":
                self._advance()
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="→",
                    raw_value="→",
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="IMPLICATION"
                ))
                continue

            if ch == "↔":
                self._advance()
                tokens.append(Token(
                    type=TokenType.OPERATOR,
                    value="↔",
                    raw_value="↔",
                    position=start_pos,
                    length=1,
                    line=start_line,
                    column=start_col,
                    sub_type="EQUIVALENCE"
                ))
                continue

            # 6. LaTeX style or Word operators (\forall, \exists, \neg, \land, \lor, \to, \iff)
            if ch == "\\":
                rest = self.raw_text[self.cursor:]
                match = re.match(r"^\\(forall|exists|neg|lnot|not|land|wedge|and|lor|vee|or|to|rightarrow|implies|iff|leftrightarrow)", rest, re.IGNORECASE)
                if match:
                    cmd = match.group(1).lower()
                    kw_len = len(match.group(0))
                    raw = self._advance(kw_len)
                    if cmd in ("forall",):
                        tokens.append(Token(TokenType.QUANTIFIER, "∀", raw, start_pos, kw_len, start_line, start_col, "UNIVERSAL"))
                    elif cmd in ("exists",):
                        tokens.append(Token(TokenType.QUANTIFIER, "∃", raw, start_pos, kw_len, start_line, start_col, "EXISTENTIAL"))
                    elif cmd in ("neg", "lnot", "not"):
                        tokens.append(Token(TokenType.OPERATOR, "¬", raw, start_pos, kw_len, start_line, start_col, "NEGATION"))
                    elif cmd in ("land", "wedge", "and"):
                        tokens.append(Token(TokenType.OPERATOR, "∧", raw, start_pos, kw_len, start_line, start_col, "CONJUNCTION"))
                    elif cmd in ("lor", "vee", "or"):
                        tokens.append(Token(TokenType.OPERATOR, "∨", raw, start_pos, kw_len, start_line, start_col, "DISJUNCTION"))
                    elif cmd in ("to", "rightarrow", "implies"):
                        tokens.append(Token(TokenType.OPERATOR, "→", raw, start_pos, kw_len, start_line, start_col, "IMPLICATION"))
                    elif cmd in ("iff", "leftrightarrow"):
                        tokens.append(Token(TokenType.OPERATOR, "↔", raw, start_pos, kw_len, start_line, start_col, "EQUIVALENCE"))
                    continue

            # 7. Identifiers, Keywords, Predicates, Variables, Constants
            if ch.isalpha() or ch == "_":
                ident_match = re.match(r"^[A-Za-z_][A-Za-z0-9_]*", self.raw_text[self.cursor:])
                if ident_match:
                    ident = ident_match.group(0)
                    ident_len = len(ident)
                    lower_ident = ident.lower()

                    # Check keyword aliases
                    if lower_ident == "forall":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.QUANTIFIER, "∀", raw, start_pos, ident_len, start_line, start_col, "UNIVERSAL"))
                        continue
                    elif lower_ident == "exists":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.QUANTIFIER, "∃", raw, start_pos, ident_len, start_line, start_col, "EXISTENTIAL"))
                        continue
                    elif lower_ident == "not":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.OPERATOR, "¬", raw, start_pos, ident_len, start_line, start_col, "NEGATION"))
                        continue
                    elif lower_ident == "and":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.OPERATOR, "∧", raw, start_pos, ident_len, start_line, start_col, "CONJUNCTION"))
                        continue
                    elif lower_ident == "or":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.OPERATOR, "∨", raw, start_pos, ident_len, start_line, start_col, "DISJUNCTION"))
                        continue
                    elif lower_ident == "implies":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.OPERATOR, "→", raw, start_pos, ident_len, start_line, start_col, "IMPLICATION"))
                        continue
                    elif lower_ident == "iff":
                        raw = self._advance(ident_len)
                        tokens.append(Token(TokenType.OPERATOR, "↔", raw, start_pos, ident_len, start_line, start_col, "EQUIVALENCE"))
                        continue

                    raw = self._advance(ident_len)

                    # Determine if this identifier is a VARIABLE, CONSTANT, or PREDICATE
                    # If preceding non-whitespace token was a QUANTIFIER, this is definitely a bound VARIABLE
                    prev_tok = tokens[-1] if tokens else None
                    if prev_tok and prev_tok.type == TokenType.QUANTIFIER:
                        tokens.append(Token(
                            type=TokenType.VARIABLE,
                            value=ident,
                            raw_value=raw,
                            position=start_pos,
                            length=ident_len,
                            line=start_line,
                            column=start_col,
                            sub_type="VARIABLE"
                        ))
                        continue

                    # Peek ahead to check if directly followed by '(' (with no or minimal whitespace)
                    temp_cursor = self.cursor
                    while temp_cursor < self.length and self.raw_text[temp_cursor].isspace():
                        temp_cursor += 1
                    
                    is_followed_by_paren = (temp_cursor < self.length and self.raw_text[temp_cursor] in ("(", "["))

                    # If followed by '(' and not a bound quantifier variable, it's a Predicate
                    if is_followed_by_paren:
                        tokens.append(Token(
                            type=TokenType.PREDICATE,
                            value=ident,
                            raw_value=raw,
                            position=start_pos,
                            length=ident_len,
                            line=start_line,
                            column=start_col,
                            sub_type="PREDICATE"
                        ))
                    else:
                        tokens.append(Token(
                            type=TokenType.VARIABLE,
                            value=ident,
                            raw_value=raw,
                            position=start_pos,
                            length=ident_len,
                            line=start_line,
                            column=start_col,
                            sub_type="VARIABLE"
                        ))
                    continue

            # 8. Unrecognized / invalid character
            self._advance()
            raise LogicSyntaxException(ParseError(
                type=ErrorType.UNEXPECTED_TOKEN,
                message=f"Unexpected symbol or character '{ch}' at index {start_pos}.",
                position=start_pos,
                line=start_line,
                column=start_col,
                length=1,
                explanation=f"The symbol '{ch}' is not a valid First-Order Logic symbol or operator.",
                suggestion=f"Remove '{ch}' or replace it with a valid FOL operator (¬, ∧, ∨, →, ↔) or quantifier (∀, ∃)."
            ))

        tokens.append(Token(
            type=TokenType.EOF,
            value="",
            raw_value="",
            position=self.length,
            length=0,
            line=self.line,
            column=self.column
        ))
        return tokens
