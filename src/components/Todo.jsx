import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react';

export default function Todo() {
  const [todos, setTodos] = useLocalStorage('prod-hub-todos', []);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
        <span>To-Do List</span>
      </h2>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 transition-shadow"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No tasks yet. Enjoy your day!
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                todo.completed 
                  ? 'bg-gray-50 dark:bg-gray-700/50 border-transparent text-gray-400 dark:text-gray-500' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center space-x-3 flex-1 overflow-hidden"
              >
                {todo.completed ? (
                  <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                ) : (
                  <Circle className="text-gray-400 flex-shrink-0" size={20} />
                )}
                <span className={`truncate text-left ${todo.completed ? 'line-through' : ''}`}>
                  {todo.text}
                </span>
              </button>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Delete Todo"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
