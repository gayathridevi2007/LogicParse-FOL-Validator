import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  Code2
} from 'lucide-react';

interface LearnPageProps {
  onTryInValidator: (expr: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onTryInValidator }) => {
  const [activeSection, setActiveSection] = useState('predicates');

  const topics = [
    { id: 'predicates', label: '1. Predicates & Relations' },
    { id: 'variables', label: '2. Variables & Constants' },
    { id: 'quantifiers', label: '3. Quantifiers (∀, ∃)' },
    { id: 'operators', label: '4. Logical Connectives' },
    { id: 'parentheses', label: '5. Parentheses & Scope' },
    { id: 'duality', label: '6. Quantifier Duality & Laws' },
    { id: 'contrast', label: '7. Valid vs Invalid Formulas' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-surfaceBorder pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            First-Order Logic Interactive Academy
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Master the formal syntax, semantics, operator precedence, and quantifier binding of First-Order Logic (FOL).
        </p>
      </div>

      {/* Main Grid: Sidebar Navigation | Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-3">
            FOL Topics
          </span>
          <div className="space-y-1">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveSection(t.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeSection === t.id
                    ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40 shadow-glow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. Predicates */}
          {activeSection === 'predicates' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  1. Predicates and Relations
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A <strong>predicate</strong> represents a property of an object or a relation between objects. In First-Order Logic, a predicate has a fixed <strong>arity</strong> (number of arguments) enclosed in parentheses.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold">Unary Predicate (Property)</span>
                    <code className="block text-sm font-mono text-primary-300">Student(x)</code>
                    <p className="text-xs text-slate-400">States that object x possesses the property of being a Student.</p>
                    <button
                      onClick={() => onTryInValidator('Student(x)')}
                      className="mt-2 text-xs font-mono text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                    >
                      <span>Try in Validator</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold">Binary Predicate (Relation)</span>
                    <code className="block text-sm font-mono text-primary-300">Likes(x, y)</code>
                    <p className="text-xs text-slate-400">States that object x relates to object y under the Likes relationship.</p>
                    <button
                      onClick={() => onTryInValidator('Likes(x, y)')}
                      className="mt-2 text-xs font-mono text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                    >
                      <span>Try in Validator</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Variables & Constants */}
          {activeSection === 'variables' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  2. Variables and Constants
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  In First-Order Logic, formulas manipulate terms. Terms can be <strong>variables</strong> (placeholders bound by quantifiers) or <strong>constants</strong> (referring to specific fixed domain entities).
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold">Classical Syllogism Example</span>
                  <code className="block text-sm font-mono text-primary-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    (∀x (Human(x) → Mortal(x))) ∧ Human(socrates) → Mortal(socrates)
                  </code>
                  <p className="text-xs text-slate-400">
                    Here <code className="text-cyan-300">x</code> is a variable bound by <code className="text-amber-300">∀</code>, while <code className="text-emerald-300">socrates</code> is a specific domain constant.
                  </p>
                  <button
                    onClick={() => onTryInValidator('(∀x (Human(x) → Mortal(x))) ∧ Human(socrates) → Mortal(socrates)')}
                    className="text-xs font-mono text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                  >
                    <span>Validate Syllogism</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Quantifiers */}
          {activeSection === 'quantifiers' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  3. Universal (∀) and Existential (∃) Quantifiers
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Quantifiers define the scope and extent to which a formula holds across domain elements.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">Universal (∀ / forall)</span>
                    <p className="text-xs text-slate-300">"For every individual x in the domain..."</p>
                    <code className="block text-xs font-mono text-amber-300 bg-slate-900 p-2 rounded">
                      ∀x (Student(x) → Learns(x))
                    </code>
                    <button
                      onClick={() => onTryInValidator('∀x (Student(x) → Learns(x))')}
                      className="text-xs font-mono text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                    >
                      <span>Try Universal Formula</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">Existential (∃ / exists)</span>
                    <p className="text-xs text-slate-300">"There exists at least one individual x..."</p>
                    <code className="block text-xs font-mono text-amber-300 bg-slate-900 p-2 rounded">
                      ∃x (Human(x) ∧ Smart(x))
                    </code>
                    <button
                      onClick={() => onTryInValidator('∃x (Human(x) ∧ Smart(x))')}
                      className="text-xs font-mono text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                    >
                      <span>Try Existential Formula</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. Connectives */}
          {activeSection === 'operators' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  4. Logical Connectives and Precedence
                </h2>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-5 text-xs font-mono font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <span>Operator</span>
                    <span>Symbol</span>
                    <span>ASCII</span>
                    <span>Precedence</span>
                    <span>Associativity</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="grid grid-cols-5 text-slate-200">
                      <span>Negation (NOT)</span>
                      <span className="text-rose-400 font-bold">¬</span>
                      <span>!, ~, not</span>
                      <span>5 (Highest)</span>
                      <span>Unary prefix</span>
                    </div>
                    <div className="grid grid-cols-5 text-slate-200">
                      <span>Conjunction (AND)</span>
                      <span className="text-rose-400 font-bold">∧</span>
                      <span>&, &&, and</span>
                      <span>4</span>
                      <span>Left-to-right</span>
                    </div>
                    <div className="grid grid-cols-5 text-slate-200">
                      <span>Disjunction (OR)</span>
                      <span className="text-rose-400 font-bold">∨</span>
                      <span>|, ||, or</span>
                      <span>3</span>
                      <span>Left-to-right</span>
                    </div>
                    <div className="grid grid-cols-5 text-slate-200">
                      <span>Implication</span>
                      <span className="text-rose-400 font-bold">→</span>
                      <span>-&gt;, =&gt;, implies</span>
                      <span>2</span>
                      <span>Right-to-left</span>
                    </div>
                    <div className="grid grid-cols-5 text-slate-200">
                      <span>Biconditional (IFF)</span>
                      <span className="text-rose-400 font-bold">↔</span>
                      <span>&lt;-&gt;, &lt;=&gt;, iff</span>
                      <span>1 (Lowest)</span>
                      <span>Left-to-right</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Parentheses */}
          {activeSection === 'parentheses' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  5. Parentheses and Variable Scoping
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Parentheses explicitly dictate the quantifier scope. Observe the difference:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">Wide Quantifier Scope</span>
                    <code className="block text-xs font-mono text-primary-300">∀x (P(x) → Q(x))</code>
                    <p className="text-xs text-slate-400">The quantifier ∀x binds x in both P(x) and Q(x).</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">Narrow Quantifier Scope</span>
                    <code className="block text-xs font-mono text-primary-300">(∀x P(x)) → Q(x)</code>
                    <p className="text-xs text-slate-400">The quantifier ∀x binds only P(x); the x in Q(x) is free.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. Duality */}
          {activeSection === 'duality' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  6. Quantifier Duality (De Morgan's Laws)
                </h2>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-mono text-amber-400 font-bold">Equivalence Laws:</span>
                  <div className="space-y-2 font-mono text-xs text-slate-200">
                    <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between">
                      <code>¬(∀x P(x)) ↔ ∃x ¬P(x)</code>
                      <button
                        onClick={() => onTryInValidator('¬(∀x P(x)) ↔ ∃x ¬P(x)')}
                        className="text-primary-400 hover:text-primary-300"
                      >
                        Try →
                      </button>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between">
                      <code>¬(∃x P(x)) ↔ ∀x ¬P(x)</code>
                      <button
                        onClick={() => onTryInValidator('¬(∃x P(x)) ↔ ∀x ¬P(x)')}
                        className="text-primary-400 hover:text-primary-300"
                      >
                        Try →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. Valid vs Invalid Contrast */}
          {activeSection === 'contrast' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-white font-mono">
                  7. Valid vs. Invalid Expression Contrast Table
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>VALID: ∀x (Student(x) → Learns(x))</span>
                      </div>
                      <p className="text-xs text-slate-300">Balanced parens, valid predicate arity (1), clear quantifier binding.</p>
                    </div>

                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-rose-400 font-bold">
                        <XCircle className="w-4 h-4" />
                        <span>INVALID: ∀x (Student(x) → Learns(x)</span>
                      </div>
                      <p className="text-xs text-slate-300">Missing closing parenthesis matching '(' opened at index 3.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>VALID: ∃x (Human(x) ∧ Smart(x))</span>
                      </div>
                      <p className="text-xs text-slate-300">Conjunction cleanly joins two unary predicates under existential scope.</p>
                    </div>

                    <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-rose-400 font-bold">
                        <XCircle className="w-4 h-4" />
                        <span>INVALID: ∀x (Human(x) ∧ ∧ Smart(x))</span>
                      </div>
                      <p className="text-xs text-slate-300">Consecutive binary operators '∧ ∧' without an operand between them.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
