import React, { useState, useEffect } from 'react';
import Todo from './components/Todo';
import Pomodoro from './components/Pomodoro';
import Notes from './components/Notes';
import Habit from './components/Habit';
import { LayoutDashboard, CheckSquare, Timer, FileText, Activity, Sun, Moon, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('todo');
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
    { id: 'todo', label: 'To-Do List', icon: CheckSquare, color: 'text-indigo-500' },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer, color: 'text-rose-500' },
    { id: 'notes', label: 'Quick Notes', icon: FileText, color: 'text-amber-500' },
    { id: 'habits', label: 'Habit Tracker', icon: Activity, color: 'text-violet-500' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-300">
        <div className="p-6 flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Productivity Hub
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `bg-slate-100 dark:bg-slate-800 shadow-sm font-semibold relative overflow-hidden group` 
                    : `hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-medium`
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                )}
                <Icon size={20} className={`${isActive ? item.color : ''} transition-colors`} />
                <span className={isActive ? 'text-slate-900 dark:text-slate-100' : ''}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium">Theme</span>
            {isDarkMode ? 
              <Sun size={20} className="text-amber-400" /> : 
              <Moon size={20} className="text-slate-600" />
            }
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10 transition-colors duration-300 shadow-sm">
          <div className="flex items-center space-x-2">
            <LayoutDashboard size={20} className="text-indigo-500" />
            <h1 className="font-bold text-lg">Productivity Hub</h1>
          </div>
          <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
             {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex overflow-x-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 hide-scrollbar pt-2 z-10 transition-colors duration-300">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-all ${
                  isActive 
                    ? `border-indigo-500 text-indigo-600 dark:text-indigo-400` 
                    : `border-transparent text-slate-500 dark:text-slate-400`
                }`}
              >
                <Icon size={18} className={isActive ? item.color : ''} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Workspace */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto relative custom-scrollbar">
            
            {/* Background Decorations (optional dynamic feel) */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="fixed bottom-20 left-60 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="h-full transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 relative z-0">
              {activeTab === 'todo' && <Todo />}
              {activeTab === 'pomodoro' && <Pomodoro />}
              {activeTab === 'notes' && <Notes />}
              {activeTab === 'habits' && <Habit />}
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;
