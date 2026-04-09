import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Todo from './components/Todo';
import Pomodoro from './components/Pomodoro';
import Notes from './components/Notes';
import Habit from './components/Habit';
import Dashboard from './components/Dashboard';
import { LayoutDashboard, Home, CheckSquare, Timer, FileText, Activity, Sun, Moon, Sparkles, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from user preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'todo', label: 'To-Do List', icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'notes', label: 'Quick Notes', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'habits', label: 'Habit Tracker', icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  const tabContent = {
    dashboard: <Dashboard setActiveTab={setActiveTab} />,
    todo: <Todo />,
    pomodoro: <Pomodoro />,
    notes: <Notes />,
    habits: <Habit />,
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-xl z-20 transition-all duration-300">
        <div className="p-8 flex items-center space-x-3 mb-6">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2.5 premium-gradient text-white rounded-2xl shadow-lg shadow-indigo-500/30"
          >
            <LayoutDashboard size={26} />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Productivity Hub
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-slate-500">Workspace</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full premium-button group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20` 
                    : `hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border border-transparent`
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? item.bg : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-700'}`}>
                  <Icon size={18} className={`${isActive ? item.color : 'text-slate-400 dark:text-slate-500'} group-hover:scale-110 transition-transform`} />
                </div>
                <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-6 space-y-3">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-slate-700 text-amber-600 dark:text-amber-400">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <span className="text-sm font-semibold tracking-tight">Theme</span>
            </div>
            <div className={`w-10 h-6 p-1 rounded-full transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
              <motion.div 
                animate={{ x: isDarkMode ? 16 : 0 }}
                className="w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-20 transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-500 text-white rounded-lg">
              <LayoutDashboard size={18} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Productivity Hub</h1>
          </div>
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
             {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex overflow-x-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 hide-scrollbar py-2 px-4 z-10 transition-colors duration-300 gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? `bg-indigo-500 text-white shadow-lg shadow-indigo-500/20` 
                    : `text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800`
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Workspace */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto relative custom-scrollbar">
            
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]" 
              />
              <motion.div 
                animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" 
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full relative z-0"
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

export default App;
