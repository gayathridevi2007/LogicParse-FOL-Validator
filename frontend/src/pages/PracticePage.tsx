import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { PracticeQuestion, PracticeCheckResponse } from '../types/fol';
import { getPracticeQuestions, checkPracticeAnswer } from '../services/api';

export const PracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Record<number, PracticeCheckResponse>>({});
  const [checking, setChecking] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getPracticeQuestions()
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setQuestions([
          {
            id: 1,
            difficulty: 'Beginner',
            category: 'Quantifiers & Predicates',
            question: 'Which of the following is syntactically valid in First-Order Logic?',
            options: [
              '∀x Student(x)',
              '∀ (x Student(x)',
              'Student( )',
              '∧ Student(x)'
            ]
          },
          {
            id: 2,
            difficulty: 'Beginner',
            category: 'Parentheses & Arity',
            question: "Why is the expression '∀x (Human(x) → Mortal(x)' invalid?",
            options: [
              "Implication operator '→' cannot be used with quantifiers",
              "Missing closing parenthesis ')' to balance the '(' after ∀x",
              "Predicate names must be lowercase",
              "The variable 'x' is undefined"
            ]
          }
        ]);
        setLoading(false);
      });
  }, []);

  const handleSelectOption = async (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setChecking((prev) => ({ ...prev, [questionId]: true }));

    try {
      const res = await checkPracticeAnswer(questionId, optionIndex);
      setResults((prev) => ({ ...prev, [questionId]: res }));
      if (res.is_correct) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch {
      // Fallback
    } finally {
      setChecking((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setResults({});
  };

  const filteredQuestions = activeDifficulty === 'All'
    ? questions
    : questions.filter((q) => q.difficulty === activeDifficulty);

  const totalAnswered = Object.keys(results).length;
  const totalCorrect = Object.values(results).filter((r) => r.is_correct).length;
  const scorePercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surfaceBorder pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              Interactive FOL Practice & Quiz Arena
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Test your First-Order Logic syntax intuition. Answers are validated live by the backend engine.
          </p>
        </div>

        {/* Score Card */}
        {totalAnswered > 0 && (
          <div className="flex items-center space-x-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Score</span>
              <div className="text-lg font-bold font-mono text-white">
                {totalCorrect} / {totalAnswered} ({scorePercent}%)
              </div>
            </div>
            <button
              onClick={handleResetQuiz}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Difficulty Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            onClick={() => setActiveDifficulty(diff)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeDifficulty === diff
                ? 'bg-primary-600 text-white shadow-glow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const selectedOpt = selectedAnswers[q.id];
          const result = results[q.id];
          const isChecking = checking[q.id];

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.05 }}
              className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary-400 uppercase tracking-wider">
                  QUESTION {q.id} • {q.category}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  q.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : q.difficulty === 'Intermediate'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}>
                  {q.difficulty}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-white font-mono">
                {q.question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  const isCorrect = result && result.correct_option_index === optIdx;
                  const isWrong = result && isSelected && !result.is_correct;

                  let optClass = 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300';
                  if (isSelected && isChecking) {
                    optClass = 'bg-primary-950/30 border-primary-500 text-primary-200';
                  } else if (result) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-glow-emerald';
                    } else if (isWrong) {
                      optClass = 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-glow-rose';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isChecking || result !== undefined}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3.5 rounded-xl border text-left font-mono text-sm font-medium transition-all flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {result && (
                        <div>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                          {isWrong && <XCircle className="w-5 h-5 text-rose-400" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-xl border space-y-1.5 ${
                    result.is_correct
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider">
                    {result.is_correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{result.is_correct ? 'Correct Decision' : 'Incorrect Selection'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
