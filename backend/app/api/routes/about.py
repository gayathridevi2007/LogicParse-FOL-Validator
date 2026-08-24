from fastapi import APIRouter

router = APIRouter(prefix="/api/about", tags=["About"])

ABOUT_DATA = {
    "project_title": "Predicate Logic Expression Validator for First-Order Logic",
    "short_title": "LogicParse",
    "tagline": "Real-time First-Order Logic Syntax Validation, AST Generation, and Lexical Analysis Engine",
    "problem_statement": (
        "First-Order Logic (FOL) forms the bedrock of automated theorem proving, formal software verification, "
        "knowledge representation in artificial intelligence, and database query semantics. However, manually "
        "validating complex logical expressions with multiple quantifiers, predicates, nested connectives, and "
        "parenthetical scoping is error-prone. Existing tools are often command-line utilities lacking immediate "
        "contextual syntax error diagnostics, interactive parse-tree visualization, and step-by-step lexical decomposition."
    ),
    "proposed_solution": (
        "LogicParse provides a comprehensive, production-grade web platform powered by a real recursive-descent "
        "parsing pipeline in Python/FastAPI. The engine enforces formal FOL EBNF grammar, extracts detailed lexical "
        "tokens with exact position spans, generates hierarchical Abstract Syntax Trees (AST), performs quantifier-scope "
        "and predicate arity validation, and returns actionable syntax error guidance."
    ),
    "architecture_pipeline": [
        {
            "step": 1,
            "name": "User Input Reception",
            "description": "Receives arbitrary First-Order Logic formulas containing Unicode (∀, ∃, ¬, ∧, ∨, →, ↔) or ASCII keywords (forall, exists, ->, etc.)."
        },
        {
            "step": 2,
            "name": "Input Preprocessing",
            "description": "Normalizes whitespace, maps aliases to canonical symbols, and calculates source character offsets."
        },
        {
            "step": 3,
            "name": "Lexical Analysis (Tokenizer)",
            "description": "Scans input into typed tokens (Quantifiers, Predicates, Variables, Constants, Operators, Parentheses) tracking 1-based line and column positions."
        },
        {
            "step": 4,
            "name": "Predicate & Grammar Parsing",
            "description": "Recursive descent parser verifies syntactic rules, operator precedence, associativity, and predicate argument structures."
        },
        {
            "step": 5,
            "name": "Semantic & Arity Validation",
            "description": "Performs parenthetical balance analysis, predicate arity consistency checks across occurrences, and variable binding classification."
        },
        {
            "step": 6,
            "name": "Result & AST Generation",
            "description": "Produces validation decision, token classification stream, statistical breakdowns, visual parse tree, and precise error diagnostics if invalid."
        }
    ],
    "modules": [
        {
            "name": "Lexer & Preprocessor",
            "tech": "Python / Regex / Token Streams",
            "responsibility": "Scans characters, categorizes tokens, tracks character spans, and reports unexpected symbols."
        },
        {
            "name": "Recursive Descent Parser",
            "tech": "Python / AST Node Hierarchy",
            "responsibility": "Enforces EBNF grammar hierarchy, builds AST, validates nested parentheses and connective rules."
        },
        {
            "name": "FOL Validator & Semantic Engine",
            "tech": "Python / Set Analysis",
            "responsibility": "Audits predicate arities, detects free vs. bound variables, aggregates token and syntax metrics."
        },
        {
            "name": "REST API Service",
            "tech": "FastAPI / Pydantic v2 / Uvicorn",
            "responsibility": "Handles validation requests, serves history, example repositories, and quiz verification."
        },
        {
            "name": "Persistence Engine",
            "tech": "SQLAlchemy 2.0 / SQLite",
            "responsibility": "Maintains persistent logs of validation attempts, error frequencies, and AST snapshots."
        },
        {
            "name": "Interactive UI / Visualizer",
            "tech": "React 18 / TypeScript / Tailwind CSS / Framer Motion",
            "responsibility": "Provides formula editor, live pipeline stepper, token badges, interactive SVG parse trees, and error highlight cards."
        }
    ],
    "tech_stack": {
        "frontend": ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Lucide Icons", "Framer Motion"],
        "backend": ["Python 3.11", "FastAPI", "Pydantic v2", "SQLAlchemy 2.0", "Uvicorn"],
        "database": ["SQLite 3"],
        "testing": ["Pytest", "HTTPX"]
    },
    "formal_grammar_ebnf": """
<Formula>          ::= <IffExpr>
<IffExpr>          ::= <ImpliesExpr> ( "↔" <ImpliesExpr> )*
<ImpliesExpr>      ::= <OrExpr> ( "→" <ImpliesExpr> )?
<OrExpr>           ::= <AndExpr> ( "∨" <AndExpr> )*
<AndExpr>          ::= <UnaryExpr> ( "∧" <UnaryExpr> )*
<UnaryExpr>        ::= "¬" <UnaryExpr> | <QuantifierExpr> | <PrimaryExpr>
<QuantifierExpr>   ::= ("∀" | "∃") <Variable> <UnaryExpr>
<PrimaryExpr>      ::= <Predicate> | "(" <Formula> ")"
<Predicate>        ::= <Identifier> "(" <ArgumentList> ")"
<ArgumentList>     ::= <Identifier> ( "," <Identifier> )*
    """.strip(),
    "viva_qa": [
        {
            "q": "How does LogicParse distinguish a Predicate from a Variable?",
            "a": "The Lexer and Parser identify a Predicate when an identifier is immediately followed by opening parenthesis '(' containing arguments (e.g. Student(x)). Single identifiers appearing directly after quantifiers or inside argument lists without parens are treated as variables or constants."
        },
        {
            "q": "How is operator precedence enforced in the parser?",
            "a": "Through the stratified grammar hierarchy: Negation & Quantifiers (highest) -> Conjunction (∧) -> Disjunction (∨) -> Implication (→, right-associative) -> Equivalence (↔). Each grammar layer calls the next tighter-binding layer."
        },
        {
            "q": "Why is a Recursive Descent Parser preferred over regex for FOL validation?",
            "a": "First-Order Logic expressions are context-free languages with arbitrary nested parenthetical depths and recursive operator scopes. Regular expressions cannot match arbitrary nested parentheses (Chomsky Hierarchy Level 3 vs Level 2)."
        },
        {
            "q": "What happens when an expression is invalid?",
            "a": "The parser intercepts the specific syntax anomaly, captures exact character offset, line, and column, and constructs a structured ParseError containing the error type, detailed explanation, and fix suggestion."
        }
    ]
}

@router.get("")
def get_about_info():
    return ABOUT_DATA
