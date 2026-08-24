import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  ChevronDown, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Code2, 
  Sparkles 
} from 'lucide-react';
import { ParseTreeNode } from '../../types/fol';

interface ParseTreeVisualizerProps {
  tree: ParseTreeNode | null;
}

interface TreeNodeItemProps {
  node: ParseTreeNode;
  depth?: number;
  isLast?: boolean;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({ node, depth = 0, isLast = true }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const getNodeBadge = (type: string) => {
    switch (type) {
      case 'Quantifier':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      case 'BinaryOp':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
      case 'UnaryOp':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]';
      case 'Predicate':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]';
      case 'Argument':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="relative flex flex-col items-start pl-6 my-1.5 select-none">
      {/* Branch connector lines */}
      {depth > 0 && (
        <>
          <div className="absolute -left-0 top-3 w-6 h-px bg-slate-700/80" />
          <div className="absolute -left-0 -top-2 bottom-3 w-px bg-slate-700/80" />
        </>
      )}

      {/* Node content badge */}
      <div className="flex items-center space-x-2 group">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-5 h-5 flex items-center justify-center text-slate-600">
            •
          </span>
        )}

        <div
          className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center space-x-2 transition-all group-hover:border-primary-400/60 ${getNodeBadge(
            node.type
          )}`}
        >
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 opacity-80">
            {node.type}
          </span>
          <span className="text-sm font-bold text-white tracking-wide">
            {node.label || node.name || node.operator || node.quantifier}
          </span>
          {node.arity !== undefined && (
            <span className="text-[10px] text-indigo-300/80">
              (arity={node.arity})
            </span>
          )}
        </div>
      </div>

      {/* Recursive children rendering */}
      <AnimatePresence>
        {!collapsed && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full pl-2 border-l border-slate-800/60 ml-2.5 mt-1 space-y-1"
          >
            {node.children!.map((child, idx) => (
              <TreeNodeItem
                key={idx}
                node={child}
                depth={depth + 1}
                isLast={idx === node.children!.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ParseTreeVisualizer: React.FC<ParseTreeVisualizerProps> = ({ tree }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'json'>('tree');

  if (!tree) {
    return (
      <div className="p-8 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
        <GitFork className="w-8 h-8 text-slate-600 animate-pulse" />
        <p className="text-sm text-slate-400 font-medium">
          No parse tree generated yet.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Enter a valid First-Order Logic formula to construct and inspect the Abstract Syntax Tree (AST).
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitFork className="w-4 h-4 text-primary-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Abstract Syntax Tree (AST) Hierarchy
          </h3>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              viewMode === 'tree' ? 'bg-primary-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Tree</span>
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              viewMode === 'json' ? 'bg-primary-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON AST</span>
          </button>
        </div>
      </div>

      {/* Render Visual or JSON */}
      {viewMode === 'tree' ? (
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/60 overflow-x-auto min-h-[160px] custom-scrollbar">
          <TreeNodeItem node={tree} />
        </div>
      ) : (
        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96">
          {JSON.stringify(tree, null, 2)}
        </pre>
      )}
    </div>
  );
};
