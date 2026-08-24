import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Sparkles, 
  FileText, 
  Share2,
  BookmarkPlus
} from 'lucide-react';
import { SymbolToolbar } from '../components/validator/SymbolToolbar';
import { PipelineStepper } from '../components/validator/PipelineStepper';
import { StatisticsCards } from '../components/validator/StatisticsCards';
import { TokenVisualizer } from '../components/validator/TokenVisualizer';
import { ParseTreeVisualizer } from '../components/validator/ParseTreeVisualizer';
import { ErrorDisplay } from '../components/validator/ErrorDisplay';
import { ExampleSelector } from '../components/validator/ExampleSelector';
import { validateExpression } from '../services/api';
import { ValidationResponse, TokenItem } from '../types/fol';

interface ValidatorPageProps {
  initialExpression?: string;
}

export const ValidatorPage: React.FC<ValidatorPageProps> = ({ initialExpression = '' }) => {
  const [expression, setExpression] = useState<string>(initialExpression || '∀x (Student(x) → Learns(x))');
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saveToHistory, setSaveToHistory] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-validate initial expression on mount
  useEffect(() => {
    if (expression.trim()) {
      handleValidate(expression);
    }
  }, []);

  const handleValidate = async (exprToValidate?: string) => {
    const targetExpr = exprToValidate !== undefined ? exprToValidate : expression;
    if (!targetExpr.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await validateExpression({
        expression: targetExpr,
        save_to_history: saveToHistory
      });
      setValidationResult(res);
    } catch (err: any) {
      setValidationResult({
        valid: false,
        expression: targetExpr,
        tokens: [],
        statistics: { predicates: 0, variables: 0, quantifiers: 0, operators: 0, parentheses: 0 },
        errors: [
          {
            type: 'API_ERROR',
            message: err.message || 'Failed to reach validation service',
            position: 0,
            line: 1,
            column: 1,
            length: 1,
            explanation: 'The application backend could not process the request.',
            suggestion: 'Ensure the FastAPI backend is running on http://localhost:8000.'
          }
        ],
        parse_tree: null,
        pipeline_steps: [
          { step: 'INPUT_RECEIVED', name: 'Input Received', status: 'completed' },
          { step: 'SYNTAX_VALIDATION', name: 'Backend Service', status: 'error', detail: err.message }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertSymbol = (symbol: string) => {
    if (!textareaRef.current) {
      setExpression((prev) => prev + symbol);
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newExpr = expression.substring(0, start) + symbol + expression.substring(end);
    setExpression(newExpr);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + symbol.length, start + symbol.length);
      }
    }, 0);
  };

  const handleClear = () => {
    setExpression('');
    setValidationResult(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectExample = (expr: string) => {
    setExpression(expr);
    handleValidate(expr);
  };

  const handleTokenClick = (tok: TokenItem) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(tok.position, tok.position + tok.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surfaceBorder pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              FOL Expression Validator
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Validate syntax, inspect lexical tokens, and visualize Abstract Syntax Trees (AST).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs font-mono text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveToHistory}
              onChange={(e) => setSaveToHistory(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-primary-600 focus:ring-primary-500"
            />
            <span>Log to SQLite History</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Left Editor | Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Expression Editor & Toolbar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl glass-card border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                First-Order Logic Editor
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Expression"
                  className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Reset Formula"
                  className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Formula Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter First-Order Logic expression, e.g. ∀x (Student(x) → Learns(x))"
                rows={4}
                className="w-full p-4 rounded-xl bg-slate-950/90 text-primary-200 font-mono text-base sm:text-lg font-medium border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-all placeholder:text-slate-600 shadow-inner"
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
                {expression.length} chars
              </div>
            </div>

            {/* Symbol Palette */}
            <SymbolToolbar
              onInsert={handleInsertSymbol}
              onClear={handleClear}
            />

            {/* Primary Action Button */}
            <button
              onClick={() => handleValidate()}
              disabled={isLoading || !expression.trim()}
              className={`w-full py-4 rounded-xl font-bold text-base font-mono tracking-wide shadow-glow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
                isLoading || !expression.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 via-accent-violet to-primary-600 hover:from-primary-500 hover:to-accent-violet text-white shadow-glow-lg'
              }`}
            >
              <Play className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'fill-current'}`} />
              <span>{isLoading ? 'PARSING FORMULA...' : 'VALIDATE EXPRESSION'}</span>
            </button>
          </div>

          {/* Quick Examples Picker */}
          <ExampleSelector onSelectExample={handleSelectExample} />
        </div>

        {/* Right Column: Validation Analysis & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result Status Banner */}
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                validationResult.valid
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-glow-emerald'
                  : 'bg-rose-950/30 border-rose-500/50 shadow-glow-rose'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 rounded-xl border ${
                  validationResult.valid
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {validationResult.valid ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide">
                    {validationResult.valid ? '✓ VALID FIRST-ORDER LOGIC EXPRESSION' : '✕ INVALID LOGIC EXPRESSION'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {validationResult.valid
                      ? 'The formula strictly conforms to First-Order Logic EBNF grammar specifications.'
                      : 'Syntax validation failed. Inspect the detailed error explanation and fix below.'}
                  </p>
                </div>
              </div>

              {validationResult.history_id && (
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                  Log #{validationResult.history_id}
                </span>
              )}
            </motion.div>
          )}

          {/* Validation Pipeline Stepper */}
          <PipelineStepper
            steps={validationResult?.pipeline_steps || []}
            isValid={validationResult?.valid ?? null}
            isLoading={isLoading}
          />

          {/* Error Diagnosis Card (if invalid) */}
          {validationResult && !validationResult.valid && (
            <ErrorDisplay
              errors={validationResult.errors}
              expression={expression}
              onApplySuggestion={(sug) => {}}
            />
          )}

          {/* Statistics Cards (if valid or partial metrics available) */}
          {validationResult && (
            <StatisticsCards
              statistics={validationResult.statistics}
              semantics={validationResult.semantics}
              isValid={validationResult.valid}
            />
          )}

          {/* Lexical Token Stream */}
          {validationResult && validationResult.tokens && validationResult.tokens.length > 0 && (
            <TokenVisualizer
              tokens={validationResult.tokens}
              onTokenClick={handleTokenClick}
            />
          )}

          {/* Abstract Syntax Tree (AST) */}
          {validationResult && (
            <ParseTreeVisualizer tree={validationResult.parse_tree} />
          )}
        </div>
      </div>
    </div>
  );
};
