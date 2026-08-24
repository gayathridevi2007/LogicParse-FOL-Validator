import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Trash2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Eye, 
  RotateCcw, 
  Layers,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { HistoryItem } from '../types/fol';
import { getHistory, getHistoryDetail, deleteHistoryItem, clearAllHistory } from '../services/api';
import { ParseTreeVisualizer } from '../components/validator/ParseTreeVisualizer';
import { TokenVisualizer } from '../components/validator/TokenVisualizer';

interface HistoryPageProps {
  onLoadExpression: (expr: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onLoadExpression }) => {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [filterValid, setFilterValid] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistoryList(data);
    } catch {
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this validation log from SQLite database?')) {
      await deleteHistoryItem(id);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear the entire validation history?')) {
      await clearAllHistory();
      setHistoryList([]);
      setSelectedRecord(null);
    }
  };

  const handleInspect = async (id: number) => {
    try {
      const detail = await getHistoryDetail(id);
      setSelectedRecord(detail);
    } catch {
      // Fallback to item in list
      const fallback = historyList.find((h) => h.id === id);
      if (fallback) setSelectedRecord(fallback);
    }
  };

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch = item.expression.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterValid === 'Valid') return item.is_valid === true;
    if (filterValid === 'Invalid') return item.is_valid === false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surfaceBorder pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-accent-violet/20 text-accent-violet border border-accent-violet/30">
              <HistoryIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              Validation History Logs
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Persistent audit trail of parsed First-Order Logic formulas stored in SQLite.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 border border-rose-500/30 text-xs font-mono font-semibold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logged formulas..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-500 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['All', 'Valid', 'Invalid'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterValid(filter)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterValid === filter
                  ? 'bg-primary-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Records Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading history records from database...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 glass-card rounded-2xl border border-slate-800 text-center space-y-3">
          <HistoryIcon className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No validation logs found.</p>
          <p className="text-xs text-slate-500 font-mono">
            Validate expressions in the validator to automatically record logs here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => handleInspect(item.id)}
              className="p-4 rounded-xl glass-card hover:bg-slate-900/90 border border-slate-800 hover:border-primary-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center space-x-3">
                <div className={`p-2 rounded-lg border ${
                  item.is_valid
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {item.is_valid ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono font-bold text-white group-hover:text-primary-300 transition-colors">
                      {item.expression}
                    </code>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.is_valid
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {item.is_valid ? 'VALID' : 'INVALID'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                    <span>Log #{item.id}</span>
                    <span>•</span>
                    <span>Tokens: {item.token_count}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </span>
                  </div>
                  {item.error_summary && (
                    <p className="text-xs text-rose-400 font-mono mt-1">
                      {item.error_summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadExpression(item.expression);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600 text-primary-300 hover:text-white border border-primary-500/40 text-xs font-mono font-semibold transition-all flex items-center space-x-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open in Editor</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-all"
                  title="Delete Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Record Modal / Inspector */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <span className={`p-2 rounded-xl border ${
                    selectedRecord.is_valid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {selectedRecord.is_valid ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-mono text-white">
                      History Snapshot #{selectedRecord.id}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Recorded on {new Date(selectedRecord.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expression Banner */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Formula</span>
                <div className="text-lg font-bold font-mono text-primary-300">
                  {selectedRecord.expression}
                </div>
              </div>

              {/* Tokens */}
              {selectedRecord.tokens && selectedRecord.tokens.length > 0 && (
                <TokenVisualizer tokens={selectedRecord.tokens} />
              )}

              {/* Parse Tree */}
              {selectedRecord.parse_tree && (
                <ParseTreeVisualizer tree={selectedRecord.parse_tree} />
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    onLoadExpression(selectedRecord.expression);
                    setSelectedRecord(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white font-bold text-xs font-mono shadow-glow-sm"
                >
                  Load Formula into Validator
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
