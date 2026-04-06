import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckSquare, Flame, CheckCircle, Circle, ArrowRight } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [todos] = useLocalStorage('prod-hub-todos', []);
  const [habits] = useLocalStorage('prod-hub-habits', []);

  // Todo calculations
  const remainingTodos = todos.filter(t => !t.completed).length;
  const totalTodos = todos.length;
  const completedTodos = totalTodos - remainingTodos;
  
  // High Priority (just recent uncompleted for now since priority isn't added yet)
  const upcomingTodos = todos.filter(t => !t.completed).slice(0, 3);

  // Habit Streak Calculations
  const getTodayString = () => new Date().toISOString().split('T')[0];
  
  const calculateStreak = (datesCompleted) => {
    if (!datesCompleted || datesCompleted.length === 0) return 0;
    
    const sortedDates = [...datesCompleted].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    const todayStr = getTodayString();
    let hasToday = sortedDates.includes(todayStr);
    
    if (!hasToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (!sortedDates.includes(yesterdayStr)) {
        return 0; // Streak broken
      } else {
        currentDate = yesterday;
      }
    }
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  let highestStreak = 0;
  let bestHabit = null;

  habits.forEach(habit => {
    const currentStreak = calculateStreak(habit.datesCompleted);
    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
      bestHabit = habit.name;
    }
  });

  // Time based greeting
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  return (
    <div className="bg-transparent h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          {greeting}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here is an overview of your productivity today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Todo Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 font-medium mb-1 flex items-center gap-2">
                <CheckSquare size={18} />
                Remaining Tasks
              </p>
              <h3 className="text-5xl font-black tabular-nums tracking-tight mb-2">
                {remainingTodos}
              </h3>
              <p className="text-indigo-200 text-sm">
                {completedTodos} of {totalTodos} completed today
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab('todo')}
            className="mt-6 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium backdrop-blur-sm"
          >
            Go to To-Do List <ArrowRight size={18} />
          </button>
        </div>

        {/* Habit Card */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-violet-100 font-medium mb-1 flex items-center gap-2">
                <Flame size={18} className={highestStreak > 0 ? "fill-orange-400 text-orange-400" : ""} />
                Highest Active Streak
              </p>
              <h3 className="text-5xl font-black tabular-nums tracking-tight mb-2 flex items-baseline gap-2">
                {highestStreak} <span className="text-xl font-normal text-violet-200">days</span>
              </h3>
              <p className="text-violet-200 text-sm truncate max-w-[200px]">
                {highestStreak > 0 ? `Best: ${bestHabit}` : "Complete a habit to start a streak!"}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('habits')}
            className="mt-6 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium backdrop-blur-sm"
          >
            Track Habits <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Upcoming Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex-1 relative z-10 overflow-hidden">
         <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
           <CheckSquare className="text-indigo-500" size={24} />
           Up Next
         </h3>
         
         <div className="space-y-3">
           {upcomingTodos.length === 0 ? (
             <div className="text-center text-gray-500 dark:text-gray-400 py-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
               All caught up for today! Start a Pomodoro session or add a new task.
             </div>
           ) : (
             upcomingTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm group"
                onClick={() => setActiveTab('todo')}
              >
                <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                  <Circle className="text-gray-400 group-hover:text-indigo-400 flex-shrink-0 transition-colors" size={20} />
                  <span className="truncate text-left font-medium text-gray-700 dark:text-gray-200">
                    {todo.text}
                  </span>
                </div>
              </div>
             ))
           )}
         </div>
      </div>

    </div>
  );
}
