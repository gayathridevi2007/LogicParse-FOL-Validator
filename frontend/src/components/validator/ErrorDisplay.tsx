import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertOctagon, 
  HelpCircle, 
  Wrench, 
  Compass, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ErrorItem } from '../../types/fol';

interface ErrorDisplayProps {
  errors: ErrorItem[];
  expression: string;
  onApplySuggestion?: (suggestion: string) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, expression, onApplySuggestion }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-background border border-rose-500/40 shadow-glow-rose space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wider text-rose-400 uppercase">
              ✕ INVALID FIRST-ORDER LOGIC EXPRESSION
            </h3>
            <p className="text-xs text-slate-400">
              The parser encountered a syntax or grammar violation during validation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {errors.map((err, idx) => {
          // Generate visual pointer under error position in formula
          const pos = Math.min(Math.max(0, err.position), expression.length);
          const beforeErr = expression.slice(0, pos);
          const errChar = expression.slice(pos, pos + (err.length || 1)) || ' ';
          const afterErr = expression.slice(pos + (err.length || 1));

          return (
            <div
              key={idx}
              className="p-4 bg-slate-950/90 rounded-xl border border-rose-500/30 space-y-3"
            >
              {/* Error Header & Type Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-xs font-bold">
                  {err.type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Character Index: <strong className="text-white">{err.position}</strong> (Line {err.line}, Col {err.column})
                </span>
              </div>

              {/* Main Error Message */}
              <div className="text-sm font-semibold text-rose-200 flex items-start space-x-2">
                <span>{err.message}</span>
              </div>

              {/* Visual Formula Highlighter Pointer */}
              {expression && (
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto space-y-1">
                  <div className="text-slate-400">
                    <span>{beforeErr}</span>
                    <span className="bg-rose-600 text-white font-bold px-1 rounded shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                      {errChar}
                    </span>
                    <span>{afterErr}</span>
                  </div>
                  {/* Caret pointer */}
                  <div className="text-rose-400 font-bold select-none whitespace-pre">
                    {' '.repeat(pos)}^--- Syntax violation detected here
                  </div>
                </div>
              )}

              {/* Detailed Explanation & Suggestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-mono font-semibold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>WHY IT IS INVALID:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {err.explanation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-semibold">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>HOW TO FIX IT:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {err.suggestion}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
