import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, Trophy, Flame } from 'lucide-react';

export default function Habit() {
  const [habits, setHabits] = useLocalStorage('prod-hub-habits', []);
  const [inputValue, setInputValue] = useState('');

  // Get current date string (YYYY-MM-DD)
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newHabit = {
      id: crypto.randomUUID(),
      name: inputValue.trim(),
      datesCompleted: [], // Array of date strings
      createdAt: Date.now()
    };
    
    setHabits([...habits, newHabit]);
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
    
    // Check if today is completed
    const todayStr = getTodayString();
    let hasToday = sortedDates.includes(todayStr);
    
    if (!hasToday) {
      // If today is not completed, maybe yesterday was the last
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (!sortedDates.includes(yesterdayStr)) {
        return 0; // Streak broken
      } else {
        currentDate = yesterday;
      }
    }
    
    // Count backward
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

  // Generate last 7 days including today
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        str: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' })
      });
    }
    return days;
  };

  const days = getLast7Days();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-violet-600 dark:text-violet-400">
        <span>Habits & Streaks</span>
      </h2>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New habit (e.g., Read 30 mins)..."
          className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-gray-100 transition-shadow"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {habits.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No habits matched. Time to build some!
          </div>
        ) : (
          habits.map(habit => {
            const streak = calculateStreak(habit.datesCompleted);
            return (
              <div key={habit.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
                    {habit.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-orange-500 font-medium">
                      <Flame size={18} className={streak > 0 ? "fill-current" : ""} />
                      <span>{streak}</span>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mt-2">
                  {days.map((day, index) => {
                    const isCompleted = habit.datesCompleted.includes(day.str);
                    const isToday = index === 6;
                    
                    return (
                      <div key={day.str} className="flex flex-col items-center">
                        <span className={`text-xs mb-1 ${isToday ? 'font-bold text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {day.label}
                        </span>
                        <button
                          onClick={() => toggleDay(habit.id, day.str)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-violet-500 text-white shadow-md transform scale-110' 
                              : 'bg-gray-100 dark:bg-gray-700 text-transparent hover:bg-violet-100 dark:hover:bg-violet-900'
                          } ${isToday && !isCompleted ? 'ring-2 ring-violet-200 dark:ring-violet-800' : ''}`}
                        >
                          {isCompleted && <Trophy size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
