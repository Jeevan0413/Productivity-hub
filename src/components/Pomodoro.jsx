import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Play, Pause, RotateCcw, Settings2, X, Check, Timer, Zap } from 'lucide-react';

export default function Pomodoro() {
  const [focusLength, setFocusLength] = useLocalStorage('prod-hub-focus-len', 25);
  const [breakLength, setBreakLength] = useLocalStorage('prod-hub-break-len', 5);
  const [totalFocusTime, setTotalFocusTime] = useLocalStorage('prod-hub-focus-time', 0);

  const [timeLeft, setTimeLeft] = useState(focusLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [showSettings, setShowSettings] = useState(false);

  const [tempFocus, setTempFocus] = useState(focusLength);
  const [tempBreak, setTempBreak] = useState(breakLength);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusLength * 60 : breakLength * 60);
  }, [mode, focusLength, breakLength]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'focus' && prev % 60 === 0 && prev !== focusLength * 60) {
             setTotalFocusTime(t => t + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      setMode(mode === 'focus' ? 'break' : 'focus');
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, focusLength, setTotalFocusTime]);

  useEffect(() => {
    resetTimer();
  }, [mode, focusLength, breakLength, resetTimer]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = useMemo(() => {
    const total = mode === 'focus' ? focusLength * 60 : breakLength * 60;
    return ((total - timeLeft) / total) * 100;
  }, [timeLeft, mode, focusLength, breakLength]);

  const saveSettings = () => {
    setFocusLength(tempFocus);
    setBreakLength(tempBreak);
    setShowSettings(false);
    resetTimer();
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: isRunning ? [1, 1.1, 1] : 1,
          opacity: isRunning ? [0.1, 0.2, 0.1] : 0.05 
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute inset-0 -z-10 blur-[100px] transition-colors duration-1000 ${
          mode === 'focus' ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />

      <div className="absolute top-8 right-8 z-20">
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={() => setShowSettings(true)}
          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <Settings2 size={24} />
        </motion.button>
      </div>

      <div className="flex space-x-2 mb-12 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl z-10 border border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={() => setMode('focus')}
          className={`px-8 py-2.5 rounded-xl font-bold tracking-tight transition-all duration-300 ${
            mode === 'focus' 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setMode('break')}
          className={`px-8 py-2.5 rounded-xl font-bold tracking-tight transition-all duration-300 ${
            mode === 'break'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Break
        </button>
      </div>

      <div className="relative flex items-center justify-center w-80 h-80 mb-12 z-10 transition-transform duration-500 hover:scale-105">
        <svg className="absolute w-full h-full transform -rotate-90 filter drop-shadow-2xl">
          <circle
            cx="160"
            cy="160"
            r="150"
            className="stroke-current text-slate-100 dark:text-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="150"
            initial={{ strokeDashoffset: 150 * 2 * Math.PI }}
            animate={{ strokeDashoffset: (150 * 2 * Math.PI) - (progress / 100) * (150 * 2 * Math.PI) }}
            className={`stroke-current transition-all duration-1000 ease-linear ${
              mode === 'focus' ? 'text-rose-500' : 'text-emerald-500'
            }`}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={150 * 2 * Math.PI}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col items-center">
          <motion.div 
            key={timeLeft}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl font-black tabular-nums tracking-tighter text-slate-800 dark:text-white"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? (mode === 'focus' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-ping') : 'bg-slate-300'}`} />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              {isRunning ? 'Currently Engaged' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-8 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
            mode === 'focus' 
              ? 'bg-rose-500 shadow-rose-500/40 hover:bg-rose-600' 
              : 'bg-emerald-500 shadow-emerald-500/40 hover:bg-emerald-600'
          }`}
        >
          {isRunning ? <Pause size={36} className="fill-current" /> : <Play size={36} className="fill-current ml-1" />}
        </motion.button>
        
        <motion.button
          whileHover={{ rotate: -180 }}
          transition={{ duration: 0.5 }}
          onClick={resetTimer}
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-inner"
        >
          <RotateCcw size={24} />
        </motion.button>
      </div>

      <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
         <div className="p-1 px-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Zap size={14} className="fill-current" />
         </div>
         <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
           Total Focus: <span className="text-slate-800 dark:text-white">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</span>
         </span>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tight">Timer Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Focus Length (min)</label>
                  <input 
                    type="range" min="1" max="60" 
                    value={tempFocus} 
                    onChange={(e) => setTempFocus(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <div className="text-center font-bold text-rose-500 mt-2">{tempFocus}:00</div>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Break Length (min)</label>
                  <input 
                    type="range" min="1" max="30" 
                    value={tempBreak} 
                    onChange={(e) => setTempBreak(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-center font-bold text-emerald-500 mt-2">{tempBreak}:00</div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveSettings}
                    className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

