import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, Trophy, Flame, Calendar, Info, TrendingUp, Activity } from 'lucide-react';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

export default function Habit() {
  const [habits, setHabits] = useLocalStorage('prod-hub-habits', []);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newHabit = {
      id: crypto.randomUUID(),
      name: inputValue.trim(),
      datesCompleted: [], 
      createdAt: new Date().toISOString()
    };
    setHabits([newHabit, ...habits]);
    setInputValue('');
  };

  const toggleDay = (habitId, dateStr) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.datesCompleted.includes(dateStr);
        const newDates = isCompleted 
          ? habit.datesCompleted.filter(d => d !== dateStr) 
          : [...habit.datesCompleted, dateStr];
        return { ...habit, datesCompleted: newDates };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const calculateStreak = (datesCompleted) => {
    if (!datesCompleted || datesCompleted.length === 0) return 0;
    const sortedDates = [...datesCompleted].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    const todayStr = format(today, 'yyyy-MM-dd');
    
    if (!sortedDates.includes(todayStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
      if (!sortedDates.includes(format(currentDate, 'yyyy-MM-dd'))) return 0;
    }
    
    while (sortedDates.includes(format(currentDate, 'yyyy-MM-dd'))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  // Generate last 30 days
  const last30Days = useMemo(() => {
    return eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    }).map(date => ({
      str: format(date, 'yyyy-MM-dd'),
      day: format(date, 'd'),
      weekday: format(date, 'EEEEEE')
    }));
  }, []);

  return (
    <div className="glass-card p-8 rounded-[2rem] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 text-violet-500 rounded-xl">
             <Activity size={24} />
          </div>
          Habits & <span className="text-violet-500">Streaks</span>
        </h2>
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-slate-500">
          <TrendingUp size={14} className="text-violet-500" />
          Last 30 Days
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-8 flex gap-3">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Build a new habit (e.g., Read 30 mins)..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 text-lg transition-all"
          />
          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={24} />
        </div>
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-violet-600/20 active:scale-95 transition-all"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {habits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 dark:text-slate-400 py-12"
            >
              <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Info size={32} />
              </div>
              <p className="font-medium">No habits being tracked. Start your journey today!</p>
            </motion.div>
          ) : (
            habits.map(habit => {
              const streak = calculateStreak(habit.datesCompleted);
              const totalCompletions = habit.datesCompleted.length;
              
              return (
                <motion.div 
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-violet-500 transition-colors">
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-orange-500 group">
                           <Flame size={18} className={streak > 0 ? "fill-current animate-pulse" : ""} />
                           <span className="text-sm font-black tracking-widest uppercase">{streak} Day Streak</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 group">
                           <Trophy size={16} />
                           <span className="text-sm font-bold">{totalCompletions} Total</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="text-slate-300 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Grid Container */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
                    {last30Days.map((day) => {
                      const isCompleted = habit.datesCompleted.includes(day.str);
                      const isToday = day.str === format(new Date(), 'yyyy-MM-dd');
                      
                      return (
                        <div key={day.str} className="relative group/day">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleDay(habit.id, day.str)}
                            className={`w-full aspect-square rounded-md transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-violet-500 shadow-sm shadow-violet-500/50' 
                                : 'bg-slate-200 dark:bg-slate-700 hover:bg-violet-200 dark:hover:bg-violet-900/50'
                            } ${isToday ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                            aria-label={`Toggle habit for ${day.str}`}
                          />
                          {/* Mini Tooltip on hover */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/day:scale-100 transition-transform bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap z-10">
                            {day.str}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

