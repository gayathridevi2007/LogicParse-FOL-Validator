# LogicParse — Predicate Logic Expression Validator for First-Order Logic

<div align="center">

**Academic Project: Predicate Logic Expression Validator for First-Order Logic**

*“Think in Logic. Validate with Precision.”*

A modern, production-grade web application with a real First-Order Logic recursive descent parser, lexical tokenizer, AST visualizer, and actionable syntax error diagnostics.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?logo=sqlite)](https://sqlite.org)

</div>

---

## 📖 1. Project Purpose & Architecture

LogicParse is designed to eliminate ambiguity and manual mistakes when parsing and evaluating First-Order Logic (FOL) formulas. Unlike basic static projects, LogicParse does **not** rely on hardcoded strings or regular expressions. It implements a true **6-Stage Lexical & Recursive Descent Parsing Pipeline**:

```
 USER INPUT FORMULA (Unicode / ASCII Shorthand)
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 1. INPUT PREPROCESSING & POSITION MAPPING    │
 └───────────────────────────────────────────────┘
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 2. LEXICAL ANALYSIS (CHARACTER-STREAM LEXER)  │
 │    Emits typed tokens with 1-indexed spans    │
 └───────────────────────────────────────────────┘
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 3. PREDICATE & TERM PARSING                   │
 │    Validates predicate arity & argument lists │
 └───────────────────────────────────────────────┘
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 4. SYNTAX VALIDATION (RECURSIVE DESCENT EBNF) │
 │    Enforces operator precedence & parens      │
 └───────────────────────────────────────────────┘
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 5. SEMANTIC ANALYSIS & SCOPING                │
 │    Audits bound vs free variables & sentences │
 └───────────────────────────────────────────────┘
         │
         ▼
 ┌───────────────────────────────────────────────┐
 │ 6. RESULT DECISION & AST GENERATION           │
 │    ✓ VALID / ✕ INVALID with Structured Errors │
 └───────────────────────────────────────────────┘
```

---

## 🔣 2. Supported First-Order Logic Grammar

| Component | Mathematical Notation | ASCII / LaTeX Shorthand | Example |
| :--- | :--- | :--- | :--- |
| **Variables** | $x, y, z, x_1, y_2$ | `x`, `y`, `z`, `x1` | `∀x (Student(x))` |
| **Constants** | $socrates, john, a, b$ | `socrates`, `john`, `a` | `Human(socrates)` |
| **Predicates** | $Student(x), Likes(x, y)$ | `Student(x)`, `Likes(x,y)` | `Parent(x, y) ∧ Parent(y, z)` |
| **Universal Quantifier** | $\forall x$ | `forall x`, `\forall x` | `∀x (Student(x) → Learns(x))` |
| **Existential Quantifier** | $\exists x$ | `exists x`, `\exists x` | `∃x (Human(x) ∧ Smart(x))` |
| **Negation (NOT)** | $\neg$ | `!`, `~`, `not`, `\neg` | `¬(∀x P(x))` |
| **Conjunction (AND)** | $\land$ | `&`, `&&`, `and`, `\land` | `P(x) ∧ Q(x)` |
| **Disjunction (OR)** | $\lor$ | `\|`, `\|\|`, `or`, `\lor` | `P(x) ∨ Q(x)` |
| **Implication** | $\to$ | `->`, `=>`, `implies` | `Student(x) → Learns(x)` |
| **Equivalence (IFF)** | $\leftrightarrow$ | `<->`, `<=>`, `iff` | `¬(∀x P(x)) ↔ ∃x ¬P(x)` |
| **Parentheses** | $( \dots ), [ \dots ]$ | `( )`, `[ ]` | `∀x (P(x) → (Q(x) ∨ R(x)))` |

---

## 🌳 3. Formal EBNF Grammar Specification

```ebnf
Formula         := IffExpr ;
IffExpr         := ImpliesExpr ( '↔' ImpliesExpr )* ;
ImpliesExpr     := OrExpr ( '→' ImpliesExpr )? ;     (* Right-associative *)
OrExpr          := AndExpr ( '∨' AndExpr )* ;
AndExpr         := UnaryExpr ( '∧' UnaryExpr )* ;
UnaryExpr       := '¬' UnaryExpr | QuantifierExpr | PrimaryExpr ;
QuantifierExpr  := ('∀' | '∃') Variable UnaryExpr ;
PrimaryExpr     := Predicate | '(' Formula ')' ;
Predicate       := Identifier '(' Argument (',' Argument)* ')' ;
Argument        := Identifier ;
```

---

## ⚡ 4. REST API Documentation

### `POST /api/validate`
Validates an arbitrary First-Order Logic expression and persists the audit attempt into SQLite.

**Request Body:**
```json
{
  "expression": "∀x (Student(x) → Learns(x))",
  "save_to_history": true
}
```

**Response (Valid Formula):**
```json
{
  "valid": true,
  "expression": "∀x (Student(x) → Learns(x))",
  "normalized_expression": "∀ x ( Student ( x ) → Learns ( x ) )",
  "tokens": [
    { "type": "QUANTIFIER", "value": "∀", "position": 0, "length": 1, "line": 1, "column": 1 },
    { "type": "VARIABLE", "value": "x", "position": 1, "length": 1, "line": 1, "column": 2 },
    { "type": "PARENTHESIS", "value": "(", "position": 3, "length": 1, "line": 1, "column": 4 },
    { "type": "PREDICATE", "value": "Student", "position": 4, "length": 7, "line": 1, "column": 5 }
  ],
  "statistics": {
    "predicates": 2,
    "unique_predicates": 2,
    "predicate_names": ["Learns", "Student"],
    "variables": 1,
    "variable_names": ["x"],
    "quantifiers": 1,
    "operators": 1,
    "parentheses": 6,
    "total_tokens": 13
  },
  "errors": [],
  "parse_tree": {
    "type": "Quantifier",
    "label": "FOR ALL (∀x)",
    "quantifier": "∀",
    "variable": "x",
    "children": [
      {
        "type": "BinaryOp",
        "label": "→ (IMPLIES)",
        "operator": "→",
        "children": [
          { "type": "Predicate", "name": "Student", "arguments": ["x"] },
          { "type": "Predicate", "name": "Learns", "arguments": ["x"] }
        ]
      }
    ]
  },
  "semantics": {
    "bound_variables": ["x"],
    "free_variables": [],
    "is_sentence": true,
    "sentence_type": "Closed Formula (Sentence)"
  },
  "history_id": 1
}
```

**Response (Invalid Formula with Detailed Diagnostics):**
```json
{
  "valid": false,
  "expression": "∀x (Student(x) → Learns(x)",
  "tokens": [...],
  "statistics": { "predicates": 2, "variables": 1, "quantifiers": 1, "operators": 1, "parentheses": 5 },
  "errors": [
    {
      "type": "MISSING_PARENTHESIS",
      "message": "Missing closing parenthesis ')' for opening parenthesis.",
      "position": 3,
      "line": 1,
      "column": 4,
      "length": 1,
      "explanation": "Parenthesis opened at position 3 was never closed in the expression.",
      "suggestion": "Add a closing ')' at the end of the expression to balance the opening parenthesis from position 3."
    }
  ],
  "parse_tree": null
}
```

### Additional Endpoints:
- `GET /api/history`: Fetch list of past validation runs with optional `?filter_valid=true|false`.
- `GET /api/history/{id}`: Fetch complete historical record including AST tree and token stream.
- `DELETE /api/history/{id}`: Delete a single history log record.
- `DELETE /api/history`: Clear all validation logs.
- `GET /api/examples`: Curated repository of FOL expressions (Beginner, Intermediate, Advanced).
- `GET /api/practice/questions`: Interactive quiz challenge questions.
- `POST /api/practice/check`: Verify student answers against the real parsing engine.
- `GET /api/about`: Project metadata, architectural stages, and viva questions.

---

## 🚀 5. How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Backend Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 🧪 6. Running Automated Backend Tests

```bash
# Run pytest test suite
pytest -v backend/tests
```

**Test Coverage Summary (25 automated test cases):**
- Lexer: Single predicates, multi-quantifiers, ASCII aliases, latex commands, empty input errors, invalid token rejection.
- Parser: AST generation, nested quantifiers, right-associative implication, disjunction & conjunction precedence, missing paren, extra paren, consecutive operators, empty predicate arguments.
- Validator: Valid formulas, quantifier duality, arity consistency checks, closed vs open sentence detection, free vs bound variables.
- API: Root, `/api/validate`, `/api/history`, `/api/examples`, `/api/practice/questions`, `/api/practice/check`.

---

## 📂 7. Project Structure

```
c:\Users\Admin\Documents\DM/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application & CORS config
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── validator.py       # POST /api/validate
│   │   │   │   ├── history.py         # GET/DELETE /api/history
│   │   │   │   ├── examples.py        # GET /api/examples
│   │   │   │   ├── practice.py        # GET/POST /api/practice
│   │   │   │   └── about.py           # GET /api/about
│   │   ├── core/
│   │   │   └── config.py              # Application settings
│   │   ├── database/
│   │   │   ├── session.py             # SQLAlchemy engine & session factory
│   │   │   └── models.py              # SQLite ValidationHistory model
│   │   ├── parser/
│   │   │   ├── tokens.py              # TokenType enum & Token model
│   │   │   ├── lexer.py               # Character-by-character scanner
│   │   │   ├── ast_nodes.py           # Typed AST node hierarchy
│   │   │   ├── grammar.py             # EBNF specification & precedence
│   │   │   ├── parser.py              # Recursive descent parser
│   │   │   ├── validator.py           # Pipeline coordinator & semantics
│   │   │   └── errors.py              # Structured error diagnostics
│   │   └── schemas/
│   │       ├── validation.py          # Pydantic schemas for requests/responses
│   │       ├── history.py
│   │       └── practice.py
│   ├── tests/
│   │   ├── test_lexer.py
│   │   ├── test_parser.py
│   │   ├── test_validator.py
│   │   └── test_api.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx         # Responsive navbar & status indicator
│   │   │   │   └── Footer.tsx         # Project footer
│   │   │   └── validator/
│   │   │       ├── SymbolToolbar.tsx  # Quick symbol insertion keypad
│   │   │       ├── PipelineStepper.tsx# 6-Stage animated execution flow
│   │   │       ├── StatisticsCards.tsx# Metric badges for formula components
│   │   │       ├── TokenVisualizer.tsx# Classified lexical token stream
│   │   │       ├── ParseTreeVisualizer.tsx # Interactive SVG AST tree & JSON
│   │   │       ├── ErrorDisplay.tsx   # Structured error card with pointer
│   │   │       └── ExampleSelector.tsx# Standard formula library
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Hero & animated workflow demo
│   │   │   ├── ValidatorPage.tsx      # Main validator workspace
│   │   │   ├── LearnPage.tsx          # Interactive FOL Academy
│   │   │   ├── PracticePage.tsx       # Live evaluated quiz arena
│   │   │   ├── HistoryPage.tsx        # SQLite validation audit logs
│   │   │   └── AboutPage.tsx          # PPT project presentation & viva prep
│   │   ├── services/
│   │   │   └── api.ts                 # Typed API client
│   │   ├── types/
│   │   │   └── fol.ts                 # TypeScript interfaces
│   │   ├── App.tsx                    # Main navigation router
│   │   ├── main.tsx
│   │   └── index.css                  # Modern dark glassmorphic styling
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.app.json
├── docker-compose.yml
└── README.md
```

---

## 🎓 8. Academic Viva / Defense Q&A

**Q1: How does LogicParse distinguish a Predicate from a Variable?**
> The Lexer and Parser classify an identifier as a Predicate when it is immediately followed by opening parenthesis `(` containing argument terms (e.g. `Student(x)`). Identifiers appearing directly after a quantifier (`∀x`) or inside argument lists without parens are classified as variables or constants.

**Q2: How is operator precedence enforced?**
> The parser uses stratified recursive descent:
> 1. Negation (`¬`) & Quantifiers (`∀`, `∃`) — Highest precedence
> 2. Conjunction (`∧`)
> 3. Disjunction (`∨`)
> 4. Implication (`→`, right-associative)
> 5. Biconditional (`↔`) — Lowest precedence

**Q3: Why not use Regular Expressions to validate FOL?**
> First-Order Logic expressions are context-free languages with arbitrary nested parenthetical depths and recursive operator scopes. Regular expressions cannot match arbitrary nested parentheses (Chomsky Hierarchy Level 3 vs Level 2).

---

© 2026 LogicParse Project — Built for First-Order Logic Academic Excellence.
