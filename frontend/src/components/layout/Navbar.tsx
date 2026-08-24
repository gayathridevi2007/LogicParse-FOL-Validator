import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  History as HistoryIcon, 
  Info, 
  Menu, 
  X,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check API health
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch {
        setApiOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'validator', label: 'Validator', icon: Terminal },
    { id: 'learn', label: 'Learn FOL', icon: BookOpen },
    { id: 'practice', label: 'Practice Quiz', icon: CheckCircle2 },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'about', label: 'Project Info', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surfaceBorder bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-accent-violet to-accent-cyan p-[1px] shadow-glow-sm group-hover:shadow-glow-md transition-all">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                <span className="font-mono text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
                  ∀x
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-extrabold tracking-wider text-lg text-white group-hover:text-primary-300 transition-colors">
                  LOGIC<span className="text-primary-500">PARSE</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  FOL v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Predicate Logic Expression Validator
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action / Status */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${
                apiOnline === true 
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' 
                  : apiOnline === false 
                  ? 'bg-amber-500' 
                  : 'bg-slate-500'
              }`} />
              <span className="text-slate-400 font-mono text-[11px]">
                {apiOnline === true ? 'ENGINE LIVE' : apiOnline === false ? 'CONNECTING...' : 'CHECKING'}
              </span>
            </div>

            {activeTab !== 'validator' && (
              <button
                onClick={() => setActiveTab('validator')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-violet hover:from-primary-500 hover:to-accent-violet/90 text-white text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
              >
                <Cpu className="w-4 h-4" />
                <span>Open Validator</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surfaceBorder bg-background/95 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 text-primary-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveTab('validator');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-accent-violet text-white text-sm font-semibold"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Validator</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
