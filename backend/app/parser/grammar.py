"""
Formal EBNF Grammar Specification for First-Order Logic (FOL):

<Formula>          ::= <IffExpr>
<IffExpr>          ::= <ImpliesExpr> ( ("↔" | "<->") <ImpliesExpr> )*
<ImpliesExpr>      ::= <OrExpr> ( ("→" | "->") <ImpliesExpr> )?   -- Right-associative
<OrExpr>           ::= <AndExpr> ( ("∨" | "|") <AndExpr> )*
<AndExpr>          ::= <UnaryExpr> ( ("∧" | "&") <UnaryExpr> )*
<UnaryExpr>        ::= ("¬" | "!" | "~") <UnaryExpr>
                     | <QuantifierExpr>
                     | <PrimaryExpr>
<QuantifierExpr>   ::= ("∀" | "∃") <Variable> <UnaryExpr>
<PrimaryExpr>      ::= <Predicate>
                     | "(" <Formula> ")"
<Predicate>        ::= <PredicateName> "(" <ArgumentList> ")"
<ArgumentList>     ::= <Term> ( "," <Term> )*
<Term>             ::= <Variable> | <Constant>
<PredicateName>    ::= [A-Za-z_][A-Za-z0-9_]*
<Variable>         ::= [A-Za-z_][A-Za-z0-9_]*
<Constant>         ::= [A-Za-z_][A-Za-z0-9_]*
"""

OPERATOR_PRECEDENCE = {
    "¬": 5,   # NOT
    "∀": 5,   # Universal Quantifier
    "∃": 5,   # Existential Quantifier
    "∧": 4,   # AND
    "∨": 3,   # OR
    "→": 2,   # IMPLIES (Right-associative)
    "↔": 1    # IFF
}

GRAMMAR_DOCS = {
    "title": "First-Order Logic (FOL) Grammar Specification",
    "description": "LogicParse implements a recursive descent parser strictly enforcing First-Order Logic semantics.",
    "ebnf": """
Formula         := IffExpr ;
IffExpr         := ImpliesExpr ( '↔' ImpliesExpr )* ;
ImpliesExpr     := OrExpr ( '→' ImpliesExpr )? ;
OrExpr          := AndExpr ( '∨' AndExpr )* ;
AndExpr         := UnaryExpr ( '∧' UnaryExpr )* ;
UnaryExpr       := '¬' UnaryExpr | QuantifierExpr | PrimaryExpr ;
QuantifierExpr  := ('∀' | '∃') Variable UnaryExpr ;
PrimaryExpr     := Predicate | '(' Formula ')' ;
Predicate       := Identifier '(' Argument (',' Argument)* ')' ;
Argument        := Identifier ;
    """.strip()
}
