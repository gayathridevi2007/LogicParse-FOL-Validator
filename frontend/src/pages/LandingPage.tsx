import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  GitFork, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Binary, 
  Split, 
  Zap 
} from 'lucide-react';

interface LandingPageProps {
  onStartValidating: (initialExpr?: string) => void;
  onExploreFOL: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartValidating, onExploreFOL }) => {
  const [activePipelineDemo, setActivePipelineDemo] = useState(4);

  const demoStages = [
    { title: "USER INPUT", val: "∀x (Student(x) → Learns(x))", status: "Received" },
    { title: "PREPROCESSING", val: "Normalize Unicode & Ascii", status: "Cleaned" },
    { title: "TOKENIZATION", val: "13 Typed Lexical Tokens", status: "Scanned" },
    { title: "PREDICATE PARSING", val: "Student/1, Learns/1", status: "Parsed" },
    { title: "SYNTAX VALIDATION", val: "Recursive Descent (EBNF)", status: "Verified" },
    { title: "RESULT DECISION", val: "✓ VALID AST GENERATED", status: "Complete" },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
        {/* Glow ambient lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-mono tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
          <span>FIRST-ORDER LOGIC SYNTAX ENGINE</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-mono">
            LOGIC<span className="bg-gradient-to-r from-primary-400 via-accent-violet to-accent-cyan bg-clip-text text-transparent">PARSE</span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-200 tracking-tight">
            “Think in Logic. Validate with Precision.”
          </p>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Write, analyze, and understand First-Order Logic expressions with intelligent syntax parsing, 
            interactive Abstract Syntax Tree generation, and actionable error diagnosis.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => onStartValidating()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-accent-violet to-primary-600 hover:from-primary-500 hover:to-accent-violet text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all active:scale-95 flex items-center space-x-2.5"
          >
            <Terminal className="w-5 h-5" />
            <span>START VALIDATING</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreFOL}
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-all hover:border-primary-500/50 flex items-center space-x-2"
          >
            <BookOpen className="w-5 h-5 text-primary-400" />
            <span>EXPLORE FOL ACADEMY</span>
          </button>
        </motion.div>

        {/* Animated Interactive Pipeline Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-10 max-w-4xl mx-auto"
        >
          <div className="p-6 rounded-2xl glass-card border border-slate-700/80 shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-slate-400 ml-2">
                  interactive-pipeline-simulation.fol
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                ✓ VALID FOL FORMULA
              </span>
            </div>

            {/* Expression Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-primary-500/30 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Target Logic Expression:
                </span>
                <div className="font-mono text-lg sm:text-xl font-bold text-primary-300">
                  ∀x (Student(x) → Learns(x))
                </div>
              </div>
              <button
                onClick={() => onStartValidating('∀x (Student(x) → Learns(x))')}
                className="px-3 py-1.5 rounded-lg bg-primary-600/30 hover:bg-primary-600 text-primary-200 hover:text-white text-xs font-mono font-semibold transition-all border border-primary-500/40"
              >
                Open in Validator
              </button>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {demoStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-center space-y-1.5 transition-all hover:border-primary-500/50"
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    STAGE 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {stage.title}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {stage.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono text-primary-400 uppercase tracking-wider font-bold">
            ENGINE CAPABILITIES
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-mono">
            Full-Stack First-Order Logic Tooling
          </p>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Everything needed to write, debug, and understand formal First-Order Logic semantics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Real Recursive Descent Parser
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No simulated or fake validation. The backend implements a true lexer, stratified operator precedence, and parenthetical parsing following EBNF grammar.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent-violet/20 text-accent-violet flex items-center justify-center border border-accent-violet/30">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Interactive Parse Trees (AST)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Inspect formulas hierarchically. Explore sub-formulas, operator bindings, quantifier scopes, and predicate argument trees visually.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Contextual Error Explanations
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pinpoint syntax mistakes with exact character indices, comprehensive explanations of why it failed, and actionable suggestions to fix it.
            </p>
          </div>
        </div>
      </section>

      {/* FOL Concepts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-mono">
                Supported First-Order Logic Syntax
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Full compatibility with mathematical logic notation and ASCII shorthand.
              </p>
            </div>
            <button
              onClick={onExploreFOL}
              className="px-4 py-2 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600 hover:text-white border border-primary-500/40 text-xs font-mono font-semibold transition-all"
            >
              Explore Full Reference →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold">01. QUANTIFIERS</span>
              <p className="font-mono text-sm text-white">∀x, ∃x, forall, exists</p>
              <p className="text-xs text-slate-400">Universal and Existential scope qualifiers.</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold">02. PREDICATES</span>
              <p className="font-mono text-sm text-white">Student(x), Likes(x, y)</p>
              <p className="text-xs text-slate-400">N-ary relations with consistent arities.</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-rose-400 font-bold">03. CONNECTIVES</span>
              <p className="font-mono text-sm text-white">¬, ∧, ∨, →, ↔</p>
              <p className="text-xs text-slate-400">NOT, AND, OR, IMPLIES, and IFF.</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">04. NESTING</span>
              <p className="font-mono text-sm text-white">( ... ) and [ ... ]</p>
              <p className="text-xs text-slate-400">Arbitrary depth parenthetical expressions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="text-center px-4 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-white font-mono">
          Ready to Validate Your First-Order Logic Formula?
        </h2>
        <p className="text-slate-400 text-sm">
          Enter any First-Order Logic formula or choose from standard academic syllogisms and equivalences.
        </p>
        <div>
          <button
            onClick={() => onStartValidating()}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet hover:from-primary-500 hover:to-accent-violet/90 text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all active:scale-95 inline-flex items-center space-x-2"
          >
            <Terminal className="w-5 h-5" />
            <span>Launch LogicParse Validator</span>
          </button>
        </div>
      </section>
    </div>
  );
};
