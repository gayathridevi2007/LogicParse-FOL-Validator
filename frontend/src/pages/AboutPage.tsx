import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Database, 
  Code2, 
  Terminal, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
  GraduationCap
} from 'lucide-react';
import { getAboutInfo } from '../services/api';
import { AboutInfo } from '../types/fol';

export const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutInfo | null>(null);
  const [activeStage, setActiveStage] = useState<number>(3);
  const [expandedQa, setExpandedQa] = useState<number | null>(0);

  useEffect(() => {
    getAboutInfo()
      .then((data) => setAboutData(data))
      .catch(() => {
        // Local fallback matching PPT
        setAboutData({
          project_title: "Predicate Logic Expression Validator for First-Order Logic",
          short_title: "LogicParse",
          tagline: "Real-time First-Order Logic Syntax Validation, AST Generation, and Lexical Analysis Engine",
          problem_statement: "First-Order Logic (FOL) forms the bedrock of formal verification and AI knowledge representation. However, manually validating complex expressions with quantifiers, nested connectives, and parenthetical scoping is error-prone. Existing tools lack immediate syntax error diagnostics and interactive AST visualization.",
          proposed_solution: "LogicParse provides a production-grade web platform powered by a recursive descent parser in Python/FastAPI. The engine enforces formal FOL EBNF grammar, extracts typed tokens with position spans, generates hierarchical ASTs, and returns actionable syntax error guidance.",
          architecture_pipeline: [
            { step: 1, name: "User Input Reception", description: "Receives arbitrary First-Order Logic formulas containing Unicode (∀, ∃, ¬, ∧, ∨, →, ↔) or ASCII shorthand." },
            { step: 2, name: "Input Preprocessing", description: "Normalizes whitespace, aligns aliases, and computes exact source character spans." },
            { step: 3, name: "Lexical Analysis (Tokenizer)", description: "Scans input into typed tokens (Quantifiers, Predicates, Variables, Constants, Operators, Parens)." },
            { step: 4, name: "Predicate & Grammar Parsing", description: "Recursive descent parser verifies syntactic rules, operator precedence, associativity, and predicate arities." },
            { step: 5, name: "Semantic & Arity Validation", description: "Audits parenthetical balance, predicate arity consistency, and free vs bound variable scopes." },
            { step: 6, name: "Result & AST Generation", description: "Produces validation decision, token classification stream, statistical breakdowns, and interactive parse tree." }
          ],
          modules: [
            { name: "Lexer & Preprocessor", tech: "Python / Regex / Stream Scanners", responsibility: "Scans characters, categorizes tokens, tracks character spans, and reports unexpected symbols." },
            { name: "Recursive Descent Parser", tech: "Python / AST Node Hierarchy", responsibility: "Enforces EBNF grammar hierarchy, builds AST, validates nested parentheses and connective rules." },
            { name: "FOL Validator & Semantic Engine", tech: "Python / Set Analysis", responsibility: "Audits predicate arities, detects free vs. bound variables, aggregates token and syntax metrics." },
            { name: "REST API Service", tech: "FastAPI / Pydantic v2 / Uvicorn", responsibility: "Handles validation requests, serves history, example repositories, and quiz verification." },
            { name: "Persistence Engine", tech: "SQLAlchemy 2.0 / SQLite", responsibility: "Maintains persistent logs of validation attempts, error frequencies, and AST snapshots." },
            { name: "Interactive UI / Visualizer", tech: "React 18 / TypeScript / Tailwind CSS", responsibility: "Provides formula editor, live pipeline stepper, token badges, interactive SVG parse trees, and error highlight cards." }
          ],
          tech_stack: {
            frontend: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Lucide Icons", "Framer Motion"],
            backend: ["Python 3.11", "FastAPI", "Pydantic v2", "SQLAlchemy 2.0", "Uvicorn"],
            database: ["SQLite 3"],
            testing: ["Pytest", "HTTPX"]
          },
          formal_grammar_ebnf: `<Formula>          ::= <IffExpr>
<IffExpr>          ::= <ImpliesExpr> ( "↔" <ImpliesExpr> )*
<ImpliesExpr>      ::= <OrExpr> ( "→" <ImpliesExpr> )?
<OrExpr>           ::= <AndExpr> ( "∨" <AndExpr> )*
<AndExpr>          ::= <UnaryExpr> ( "∧" <UnaryExpr> )*
<UnaryExpr>        ::= "¬" <UnaryExpr> | <QuantifierExpr> | <PrimaryExpr>
<QuantifierExpr>   ::= ("∀" | "∃") <Variable> <UnaryExpr>
<PrimaryExpr>      ::= <Predicate> | "(" <Formula> ")"
<Predicate>        ::= <Identifier> "(" <ArgumentList> ")"
<ArgumentList>     ::= <Identifier> ( "," <Identifier> )*`,
          viva_qa: [
            {
              q: "How does LogicParse distinguish a Predicate from a Variable?",
              a: "The Lexer and Parser identify a Predicate when an identifier is followed by an opening parenthesis '(' containing arguments (e.g. Student(x)). Single identifiers appearing directly after quantifiers or inside argument lists without parens are classified as variables or constants."
            },
            {
              q: "How is operator precedence enforced in the parser?",
              a: "Through the stratified grammar hierarchy: Negation & Quantifiers (highest) -> Conjunction (∧) -> Disjunction (∨) -> Implication (→, right-associative) -> Equivalence (↔). Each grammar layer calls the next tighter-binding layer."
            },
            {
              q: "Why is a Recursive Descent Parser preferred over regex for FOL validation?",
              a: "First-Order Logic expressions are context-free languages with arbitrary nested parenthetical depths and recursive operator scopes. Regular expressions cannot match arbitrary nested parentheses (Chomsky Hierarchy Level 3 vs Level 2)."
            },
            {
              q: "What happens when an expression is invalid?",
              a: "The parser intercepts the specific syntax anomaly, captures exact character offset, line, and column, and constructs a structured ParseError containing the error type, detailed explanation, and fix suggestion."
            }
          ]
        });
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero / Academic Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-950/40 via-slate-900/90 to-background border border-primary-500/30 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 font-mono text-xs font-bold">
            ACADEMIC PROJECT SPECIFICATION
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          Predicate Logic Expression Validator for First-Order Logic
        </h1>
        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          {aboutData?.tagline}
        </p>
      </div>

      {/* Problem Statement & Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <h2 className="text-lg font-bold text-white">Challenges in FOL Syntax Verification</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {aboutData?.problem_statement}
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Proposed Solution</span>
          </div>
          <h2 className="text-lg font-bold text-white">Modular Recursive Descent Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {aboutData?.proposed_solution}
          </p>
        </div>
      </div>

      {/* Interactive System Architecture Diagram */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
            SYSTEM ARCHITECTURE PIPELINE
          </span>
          <h2 className="text-2xl font-bold text-white font-mono">
            6-Stage Logic Verification Flow
          </h2>
          <p className="text-xs text-slate-400">
            Click on any architectural stage to inspect its functional responsibilities.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {aboutData?.architecture_pipeline.map((stage) => {
            const isSelected = activeStage === stage.step;
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveStage(stage.step)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-primary-600/30 border-primary-500 shadow-glow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">
                  STAGE 0{stage.step}
                </span>
                <span className="text-xs font-bold text-white block">
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        {aboutData && (
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 font-mono text-xs font-bold">
                STAGE 0{activeStage}: {aboutData.architecture_pipeline[activeStage - 1]?.name}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {aboutData.architecture_pipeline[activeStage - 1]?.description}
            </p>
          </div>
        )}
      </div>

      {/* Modules & Tech Stack */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-wider">
            TECHNICAL BREAKDOWN
          </span>
          <h2 className="text-2xl font-bold text-white font-mono">
            System Modules & Responsibilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aboutData?.modules.map((m, idx) => (
            <div key={idx} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{m.name}</span>
              </div>
              <span className="text-[10px] font-mono text-primary-400 bg-primary-950/40 px-2 py-0.5 rounded border border-primary-500/20 block w-fit">
                {m.tech}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {m.responsibility}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Grammar Specification (EBNF) */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            FORMAL GRAMMAR SPECIFICATION
          </span>
          <h2 className="text-2xl font-bold text-white font-mono">
            Extended Backus-Naur Form (EBNF)
          </h2>
        </div>
        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
          {aboutData?.formal_grammar_ebnf}
        </pre>
      </div>

      {/* Viva Defense Q&A Guide */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-accent-violet uppercase tracking-wider">
            PROJECT DEFENSE & VIVA PREPARATION
          </span>
          <h2 className="text-2xl font-bold text-white font-mono">
            Academic Q&A Reference Guide
          </h2>
          <p className="text-xs text-slate-400">
            Authoritative explanations of the core theoretical and implementation aspects.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {aboutData?.viva_qa.map((item, idx) => {
            const isExpanded = expandedQa === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQa(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span className="font-mono text-xs text-primary-400 mr-2">Q{idx + 1}.</span>
                  <span className="flex-1">{item.q}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-900 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
