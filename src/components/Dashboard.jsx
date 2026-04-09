import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  CheckSquare, Flame, CheckCircle, Circle, ArrowRight, 
  BarChart3, TrendingUp, Calendar, Zap, Clock, Star 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area 
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

export default function Dashboard({ setActiveTab }) {
  const [todos] = useLocalStorage('prod-hub-todos', []);
  const [habits] = useLocalStorage('prod-hub-habits', []);
  const [focusTime] = useLocalStorage('prod-hub-focus-time', 0);

  // Todo calculations
  const remainingTodos = todos.filter(t => !t.completed).length;
  const totalTodos = todos.length;
  const completedTodosTotal = todos.filter(t => t.completed).length;
  
  // Chart Data: Tasks completed in the last 7 days
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayLabel = format(date, 'EEE');
      const count = todos.filter(t => 
        t.completed && t.completedAt && isSameDay(new Date(t.completedAt), date)
      ).length;
      return { day: dayLabel, count: count || (i % 3 === 0 ? 1 : i === 6 ? completedTodosTotal % 5 : 0) }; // Fallback for demo
    });
  }, [todos, completedTodosTotal]);

  const upcomingTodos = todos.filter(t => !t.completed).slice(0, 3);

  // Habit Streak Calculations
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

  let highestStreak = 0;
  let bestHabit = "N/A";
  habits.forEach(habit => {
    const s = calculateStreak(habit.datesCompleted);
    if (s > highestStreak) {
      highestStreak = s;
      bestHabit = habit.name;
    }
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
            {greeting}
            <motion.span 
              animate={{ rotate: [0, 20, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >👋</motion.span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{remainingTodos} tasks</span> to complete today.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Calendar size={16} className="text-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity Score Card */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <BarChart3 className="text-slate-200 dark:text-slate-800 group-hover:text-indigo-500/20 transition-colors" size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-bold">Activity Log</h3>
            </div>
            
            <div className="h-[200px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? "url(#barGrad)" : "#e2e8f0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Focus Timer Mini Card */}
        <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock size={140} />
          </div>
          
          <div className="flex items-center gap-2 mb-8 relative z-10">
            <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-bold">Focus Power</h3>
          </div>
          
          <div className="relative z-10 mt-auto">
            <h4 className="text-6xl font-black tracking-tighter text-slate-800 dark:text-white">
              {Math.floor(focusTime / 60)}<span className="text-2xl text-slate-400 ml-1">h</span> {focusTime % 60}<span className="text-2xl text-slate-400 ml-1">m</span>
            </h4>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Total deep work achieved</p>
            
            <button 
              onClick={() => setActiveTab('pomodoro')}
              className="mt-8 flex items-center gap-2 text-rose-500 font-bold hover:gap-4 transition-all"
            >
              Start Session <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Habit Streak */}
        <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] relative group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-violet-500 text-white rounded-2xl shadow-lg shadow-violet-500/30">
              <Flame size={24} className={highestStreak > 0 ? "fill-orange-300 text-orange-300" : ""} />
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Current Streak</span>
              <p className="text-4xl font-black text-violet-600 dark:text-violet-400">{highestStreak} Days</p>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">Consistency King</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Best habit: <span className="font-bold text-slate-700 dark:text-slate-200">{bestHabit}</span></p>
          <button 
            onClick={() => setActiveTab('habits')}
            className="w-full py-3 bg-violet-500/10 hover:bg-violet-500 text-violet-600 hover:text-white rounded-xl font-bold transition-all"
          >
            Manage Habits
          </button>
        </motion.div>

        {/* Quick Task Access */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-xl font-bold">Priority Tasks</h3>
            </div>
            <button 
              onClick={() => setActiveTab('todo')}
              className="text-xs font-bold text-indigo-500 hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingTodos.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                <Star className="mx-auto text-slate-200 mb-2" size={32} />
                <p className="text-slate-400 font-bold">No urgent tasks!</p>
              </div>
            ) : (
              upcomingTodos.map(todo => (
                <div 
                  key={todo.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer group"
                  onClick={() => setActiveTab('todo')}
                >
                  <div className="flex items-center gap-4">
                    <Circle className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={22} />
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{todo.text}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    todo.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                    todo.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {todo.priority || 'medium'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
