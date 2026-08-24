import React from 'react';
import { Cpu, Terminal, BookOpen, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-surfaceBorder bg-[#050811] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Project Branding */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center font-mono font-bold text-white text-sm">
              ∀x
            </div>
            <span className="font-mono font-bold text-white text-base tracking-wider">
              LOGIC<span className="text-primary-400">PARSE</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Academic Project: <strong className="text-slate-200">Predicate Logic Expression Validator for First-Order Logic</strong>.
            A full-stack, formal syntax parsing and AST visualizer platform built with Python, FastAPI, and React.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              FastAPI 0.110
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              Recursive Descent Parser
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              React + TypeScript
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              SQLite
            </span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
            Modules
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button 
                onClick={() => setActiveTab('validator')} 
                className="hover:text-primary-400 transition-colors flex items-center space-x-2"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>FOL Validator</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('learn')} 
                className="hover:text-primary-400 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Logic Academy</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('practice')} 
                className="hover:text-primary-400 transition-colors flex items-center space-x-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Practice Challenges</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('about')} 
                className="hover:text-primary-400 transition-colors flex items-center space-x-2"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Architecture & EBNF</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Viva & Project Spec */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
            Academic Scope
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strictly adheres to First-Order Logic formal grammar specifications. No hardcoded or heuristic validation decisions.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('about')}
              className="inline-flex items-center space-x-1.5 text-xs text-primary-400 hover:text-primary-300 font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Defense Q&A & Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 LogicParse Engine. Academic Project Implementation.</p>
        <p className="flex items-center space-x-1">
          <span>First-Order Logic Expression Validator</span>
        </p>
      </div>
    </footer>
  );
};
