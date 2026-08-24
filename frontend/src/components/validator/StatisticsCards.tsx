import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCode2, 
  Variable, 
  Orbit, 
  Sigma, 
  Split, 
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StatisticsItem, SemanticsItem } from '../../types/fol';

interface StatisticsCardsProps {
  statistics: StatisticsItem;
  semantics?: SemanticsItem;
  isValid: boolean;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics, semantics, isValid }) => {
  const cards = [
    {
      title: 'Predicates',
      count: statistics.predicates || 0,
      sub: statistics.predicate_names?.length ? `${statistics.predicate_names.join(', ')}` : 'Atomic formulas',
      icon: FileCode2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30'
    },
    {
      title: 'Variables',
      count: statistics.variables || 0,
      sub: statistics.variable_names?.length ? `${statistics.variable_names.join(', ')}` : 'Individual terms',
      icon: Variable,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30'
    },
    {
      title: 'Quantifiers',
      count: statistics.quantifiers || 0,
      sub: '∀ (All) / ∃ (Exists)',
      icon: Orbit,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Operators',
      count: statistics.operators || 0,
      sub: '¬, ∧, ∨, →, ↔',
      icon: Sigma,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30'
    },
    {
      title: 'Parentheses',
      count: statistics.parentheses || 0,
      sub: `${(statistics.parentheses || 0) / 2} balanced pairs`,
      icon: Split,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-primary-400" />
          <span>FORMULA METRICS & CLASSIFICATION</span>
        </h3>
        {semantics && (
          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
            semantics.is_sentence
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {semantics.sentence_type}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3.5 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.02] ${card.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="my-2">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {card.count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate" title={card.sub}>
                {card.sub}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
