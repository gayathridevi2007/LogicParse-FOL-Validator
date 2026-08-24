import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SymbolToolbarProps {
  onInsert: (symbol: string) => void;
  onClear: () => void;
}

export const SymbolToolbar: React.FC<SymbolToolbarProps> = ({ onInsert, onClear }) => {
  const symbols = [
    { label: '∀', name: 'Universal Quantifier (For All)', insert: '∀', group: 'quantifier' },
    { label: '∃', name: 'Existential Quantifier (Exists)', insert: '∃', group: 'quantifier' },
    { label: '¬', name: 'Negation (NOT)', insert: '¬', group: 'operator' },
    { label: '∧', name: 'Conjunction (AND)', insert: ' ∧ ', group: 'operator' },
    { label: '∨', name: 'Disjunction (OR)', insert: ' ∨ ', group: 'operator' },
    { label: '→', name: 'Implication (IMPLIES)', insert: ' → ', group: 'operator' },
    { label: '↔', name: 'Equivalence (IFF)', insert: ' ↔ ', group: 'operator' },
    { label: '(', name: 'Left Parenthesis', insert: '(', group: 'paren' },
    { label: ')', name: 'Right Parenthesis', insert: ')', group: 'paren' },
  ];

  const quickTemplates = [
    { label: '∀x P(x)', insert: '∀x P(x)' },
    { label: '∃x Q(x)', insert: '∃x Q(x)' },
    { label: 'P(x) → Q(x)', insert: '(P(x) → Q(x))' },
    { label: 'Student(x)', insert: 'Student(x)' },
    { label: 'Likes(x, y)', insert: 'Likes(x, y)' },
  ];

  return (
    <div className="p-3 bg-slate-900/90 border border-slate-800/80 rounded-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>FOL SYMBOLS & TEMPLATES</span>
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-mono"
        >
          Clear Editor
        </button>
      </div>

      {/* Symbol Keypad */}
      <div className="flex flex-wrap items-center gap-1.5">
        {symbols.map((sym, idx) => {
          let btnClass = 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700';
          if (sym.group === 'quantifier') {
            btnClass = 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 hover:border-amber-500/50';
          } else if (sym.group === 'operator') {
            btnClass = 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 hover:border-rose-500/50';
          } else if (sym.group === 'paren') {
            btnClass = 'bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 border-primary-500/30 hover:border-primary-500/50';
          }

          return (
            <button
              key={idx}
              type="button"
              title={sym.name}
              onClick={() => onInsert(sym.insert)}
              className={`h-9 min-w-[36px] px-2.5 rounded-lg font-mono font-bold text-base border transition-all active:scale-95 shadow-sm ${btnClass}`}
            >
              {sym.label}
            </button>
          );
        })}

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Quick template pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          {quickTemplates.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(tmpl.insert)}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-800/60 hover:bg-primary-900/30 text-slate-300 hover:text-primary-300 border border-slate-700/60 hover:border-primary-500/40 transition-all"
            >
              + {tmpl.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
