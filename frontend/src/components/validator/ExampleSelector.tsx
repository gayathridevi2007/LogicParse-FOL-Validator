import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import { ExampleItem } from '../../types/fol';
import { getExamples } from '../../services/api';

interface ExampleSelectorProps {
  onSelectExample: (expression: string) => void;
}

export const ExampleSelector: React.FC<ExampleSelectorProps> = ({ onSelectExample }) => {
  const [examples, setExamples] = useState<ExampleItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExamples()
      .then((data) => {
        setExamples(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default examples if backend isn't ready
        setExamples([
          {
            id: 'ex-1',
            title: 'Universal Implication',
            expression: '∀x (Student(x) → Learns(x))',
            category: 'Universal Quantifiers',
            description: 'Every student learns.',
            is_valid: true,
            difficulty: 'Beginner'
          },
          {
            id: 'ex-2',
            title: 'Existential Conjunction',
            expression: '∃x (Human(x) ∧ Smart(x))',
            category: 'Existential Quantifiers',
            description: 'There exists someone who is human and smart.',
            is_valid: true,
            difficulty: 'Beginner'
          },
          {
            id: 'ex-3',
            title: 'Binary Relation',
            expression: '∀x ∀y (Likes(x, y) → Knows(x, y))',
            category: 'Multi-Variable Relations',
            description: 'If x likes y, then x knows y.',
            is_valid: true,
            difficulty: 'Intermediate'
          },
          {
            id: 'err-1',
            title: 'Missing Parenthesis Error',
            expression: '∀x (Student(x) → Learns(x)',
            category: 'Syntax Error Demos',
            description: 'Unclosed opening parenthesis.',
            is_valid: false,
            difficulty: 'Beginner'
          }
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Universal Quantifiers', 'Existential Quantifiers', 'Multi-Variable Relations', 'Equivalences & Duality', 'Syntax Error Demos'];

  const filteredExamples = activeCategory === 'All'
    ? examples
    : examples.filter((ex) => ex.category === activeCategory);

  return (
    <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Standard FOL Test Expressions
          </h3>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {filteredExamples.map((ex) => (
          <div
            key={ex.id}
            onClick={() => onSelectExample(ex.expression)}
            className="p-3 bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-primary-500/40 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-primary-300 transition-colors">
                  {ex.title}
                </span>
                {ex.is_valid ? (
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VALID</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/30">
                    <XCircle className="w-3 h-3" />
                    <span>INVALID</span>
                  </span>
                )}
              </div>
              <code className="block text-xs font-mono text-primary-300 bg-slate-900 px-2 py-1.5 rounded-md border border-slate-800 truncate">
                {ex.expression}
              </code>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
              {ex.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
