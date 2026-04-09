import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trash2, CheckCircle, Circle, Plus, Tag, Flag, Filter, Search, CheckSquare } from 'lucide-react';

const PRIORITIES = {
  low: { label: 'Low', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200' },
  medium: { label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200' },
  high: { label: 'High', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-200' }
};

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Fitness', 'Others'];

export default function Todo() {
  const [todos, setTodos] = useLocalStorage('prod-hub-todos', []);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null
      } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'completed' 
        ? todo.completed 
        : !todo.completed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="glass-card p-8 rounded-[2rem] h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
             <CheckSquare size={24} />
          </div>
          To-Do <span className="text-indigo-500">List</span>
        </h2>
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-8 space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-lg transition-all"
          />
          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Priority</span>
            <div className="flex gap-1.5">
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    priority === key 
                    ? `${value.bg} ${value.color} ${value.border}` 
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tag</span>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {filteredTodos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 dark:text-slate-400 py-12"
            >
              <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <p className="font-medium">No tasks found in this view.</p>
            </motion.div>
          ) : (
            filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                className={`flex items-center group p-4 rounded-2xl border transition-all ${
                  todo.completed 
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-60' 
                    : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 mr-4"
                >
                  {todo.completed ? (
                    <div className="bg-emerald-500 text-white rounded-full p-1 shadow-sm shadow-emerald-500/20">
                      <CheckCircle size={20} />
                    </div>
                  ) : (
                    <div className={`rounded-full border-2 p-1 transition-colors ${
                      PRIORITIES[todo.priority || 'medium'].color.replace('text-', 'border-')
                    }`}>
                      <Circle size={18} className="text-transparent" />
                    </div>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold tracking-tight transition-all truncate ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-100'}`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded cursor-default ${
                      PRIORITIES[todo.priority || 'medium'].bg
                    } ${PRIORITIES[todo.priority || 'medium'].color.replace('text-', 'text-')}`}>
                      {todo.priority || 'medium'}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <Tag size={10} />
                      {todo.category || 'Personal'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

