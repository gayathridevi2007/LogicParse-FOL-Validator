import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Layers } from 'lucide-react';
import { PipelineStep } from '../../types/fol';

interface PipelineStepperProps {
  steps: PipelineStep[];
  isValid: boolean | null;
  isLoading: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ steps, isValid, isLoading }) => {
  const defaultSteps: PipelineStep[] = [
    { step: 'INPUT_RECEIVED', name: 'Input Reception', status: 'pending', detail: 'Formula string' },
    { step: 'PREPROCESSING', name: 'Preprocessing', status: 'pending', detail: 'Unicode & aliases' },
    { step: 'TOKENIZATION', name: 'Lexer Tokenizer', status: 'pending', detail: 'Token stream & spans' },
    { step: 'PREDICATE_PARSING', name: 'Predicate Parsing', status: 'pending', detail: 'Arity & arguments' },
    { step: 'SYNTAX_VALIDATION', name: 'Grammar Validation', status: 'pending', detail: 'EBNF recursive descent' },
    { step: 'RESULT_GENERATED', name: 'Result Decision', status: 'pending', detail: 'AST & error report' },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Validation Execution Pipeline
          </h3>
        </div>
        {isLoading && (
          <div className="flex items-center space-x-1.5 text-xs text-primary-400 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>PROCESSING PIPELINE...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {displaySteps.map((step, idx) => {
          const isError = step.status === 'error';
          const isCompleted = step.status === 'completed';
          const isCurrent = isLoading && idx === Math.min(steps.length, displaySteps.length - 1);

          let borderStyle = 'border-slate-800 bg-slate-950/40 text-slate-400';
          let icon = <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">{idx + 1}</span>;

          if (isCompleted) {
            borderStyle = 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
          } else if (isError) {
            borderStyle = 'border-rose-500/40 bg-rose-950/20 text-rose-300';
            icon = <XCircle className="w-4 h-4 text-rose-400" />;
          } else if (isCurrent) {
            borderStyle = 'border-primary-500 bg-primary-950/30 text-primary-300 shadow-glow-sm';
            icon = <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />;
          }

          return (
            <motion.div
              key={step.step || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all ${borderStyle}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  STAGE 0{idx + 1}
                </span>
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {step.name}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                  {step.detail || 'Standby'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
