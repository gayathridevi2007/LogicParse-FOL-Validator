import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ValidatorPage } from './pages/ValidatorPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeExpression, setActiveExpression] = useState<string>('∀x (Student(x) → Learns(x))');

  const handleStartValidating = (initialExpr?: string) => {
    if (initialExpr) {
      setActiveExpression(initialExpr);
    }
    setActiveTab('validator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreFOL = () => {
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadExpressionFromHistory = (expr: string) => {
    setActiveExpression(expr);
    setActiveTab('validator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] glow-gradient-indigo opacity-30 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] glow-gradient-cyan opacity-20 pointer-events-none" />

      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            onStartValidating={handleStartValidating}
            onExploreFOL={handleExploreFOL}
          />
        )}
        {activeTab === 'validator' && (
          <ValidatorPage
            key={activeExpression}
            initialExpression={activeExpression}
          />
        )}
        {activeTab === 'learn' && (
          <LearnPage onTryInValidator={handleStartValidating} />
        )}
        {activeTab === 'practice' && <PracticePage />}
        {activeTab === 'history' && (
          <HistoryPage onLoadExpression={handleLoadExpressionFromHistory} />
        )}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
