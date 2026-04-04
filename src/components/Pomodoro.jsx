import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';

export default function Pomodoro() {
  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  }, [mode, FOCUS_TIME, BREAK_TIME]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Time is up
      if (mode === 'focus') {
        setMode('break');
      } else {
        setMode('focus');
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="flex space-x-2 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg z-10">
        <button
          onClick={() => setMode('focus')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            mode === 'focus' 
              ? 'bg-rose-500 text-white shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setMode('break')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            mode === 'break'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Break
        </button>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 mb-10 z-10">
        {/* Progress Circle SVG */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-current text-gray-100 dark:text-gray-700"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className={`stroke-current transition-all duration-1000 ease-linear ${
              mode === 'focus' ? 'text-rose-500' : 'text-emerald-500'
            }`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={120 * 2 * Math.PI}
            strokeDashoffset={(120 * 2 * Math.PI) - (progress / 100) * (120 * 2 * Math.PI)}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-6xl font-extrabold tabular-nums tracking-tight text-gray-800 dark:text-gray-100">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center space-x-6 z-10">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95 ${
            mode === 'focus' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isRunning ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset Timer"
        >
          <RotateCcw size={20} />
        </button>
      </div>

    </div>
  );
}
