import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, Tag, Info } from 'lucide-react';
import { TokenItem } from '../../types/fol';

interface TokenVisualizerProps {
  tokens: TokenItem[];
  onTokenClick?: (token: TokenItem) => void;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ tokens, onTokenClick }) => {
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);

  const getTokenStyle = (type: string, value: string) => {
    switch (type) {
      case 'QUANTIFIER':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25';
      case 'PREDICATE':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/25';
      case 'VARIABLE':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25';
      case 'CONSTANT':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25';
      case 'OPERATOR':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25';
      case 'PARENTHESIS':
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40 hover:bg-slate-700/50';
      case 'COMMA':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (!tokens || tokens.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Binary className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Lexical Token Stream ({tokens.length} tokens parsed)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Quantifier</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Predicate</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Variable</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Operator</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Paren</span>
        </div>
      </div>

      {/* Visual Token Stream */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/60 rounded-lg border border-slate-800/60 min-h-[52px]">
        {tokens.map((tok, idx) => {
          const isSelected = selectedToken?.position === tok.position;
          return (
            <motion.button
              key={`${tok.position}-${idx}`}
              type="button"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => {
                setSelectedToken(tok);
                if (onTokenClick) onTokenClick(tok);
              }}
              className={`px-2.5 py-1.5 rounded-md border font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${getTokenStyle(
                tok.type,
                tok.value
              )} ${isSelected ? 'ring-2 ring-primary-400 shadow-glow-sm' : ''}`}
            >
              <span className="text-sm font-bold">{tok.value}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-70 px-1 py-0.2 rounded bg-black/20">
                {tok.type}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Token Inspector Card */}
      {selectedToken && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-slate-950 border border-primary-500/30 rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
        >
          <div className="flex items-center space-x-3">
            <Tag className="w-4 h-4 text-primary-400" />
            <span className="text-slate-300">
              Token: <strong className="text-white text-sm bg-slate-800 px-1.5 py-0.5 rounded font-mono">{selectedToken.value}</strong>
            </span>
            <span className="text-slate-400">
              Category: <strong className="text-primary-300">{selectedToken.type}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Index Pos: <strong className="text-slate-200">{selectedToken.position}</strong></span>
            <span>Length: <strong className="text-slate-200">{selectedToken.length}</strong></span>
            <span>Col: <strong className="text-slate-200">{selectedToken.column}</strong></span>
            <button
              onClick={() => setSelectedToken(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
