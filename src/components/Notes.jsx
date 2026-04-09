import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, FileText, Check, Search, Eye, Edit3, Clock, Hash } from 'lucide-react';
import { format } from 'date-fns';

export default function Notes() {
  const [notes, setNotes] = useLocalStorage('prod-hub-notes', [
    { id: '1', title: 'Getting Started', content: '## Welcome to Notes\n\n- Quick and simple\n- **Auto-saved** locally\n- Markdown support', updatedAt: Date.now() }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  
  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.updatedAt - a.updatedAt);

  const createNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setViewMode('edit');
  };

  const updateNote = (id, field, value) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, [field]: value, updatedAt: Date.now() }
        : note
    ));
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      setActiveNoteId(newNotes[0]?.id || null);
    }
  };

  const renderPreview = (content) => {
    if (!content) return <p className="text-slate-400 italic">No content yet...</p>;
    
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mb-4 mt-6">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black mb-3 mt-5 text-indigo-500">{line.replace('## ', '')}</h2>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 list-disc font-medium">{line.replace('- ', '')}</li>;
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="mb-2">
            {parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="text-indigo-600 dark:text-indigo-400">{part}</strong> : part)}
          </p>
        );
      }
      return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="glass-card rounded-[2.5rem] h-full flex overflow-hidden border-none shadow-2xl">
      
      {/* Sidebar for Note List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <FileText size={20} className="text-amber-500" />
              Notes
            </h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={createNote}
              className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:bg-indigo-700 transition-colors"
            >
              <Plus size={18} />
            </motion.button>
          </div>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-2 pl-10 text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar px-3 pb-6">
          <AnimatePresence>
            {filteredNotes.length === 0 ? (
              <div className="p-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                No matching notes
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-4 rounded-2xl cursor-pointer group transition-all ${
                      activeNoteId === note.id 
                        ? 'bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-200 dark:ring-slate-700' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold tracking-tight truncate pr-2 ${activeNoteId === note.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {note.title || 'Untitled'}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium truncate mb-2">
                      {note.content || 'Start writing...'}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <Clock size={10} />
                      {format(note.updatedAt, 'MMM d, h:mm a')}
                    </div>
                    
                    {activeNoteId === note.id && (
                      <button 
                        onClick={(e) => deleteNote(note.id, e)}
                        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        {activeNote ? (
          <div className="flex-1 flex flex-col h-full relative">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Hash size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Editor Workspace</span>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                {viewMode === 'edit' ? (
                  <motion.div 
                    key="edit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col"
                  >
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => updateNote(activeNote.id, 'title', e.target.value)}
                      placeholder="Give it a title..."
                      className="text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-white mb-6 placeholder-slate-200 dark:placeholder-slate-800 tracking-tight"
                    />
                    <textarea
                      value={activeNote.content}
                      onChange={(e) => updateNote(activeNote.id, 'content', e.target.value)}
                      placeholder="Unleash your thoughts..."
                      className="flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-slate-600 dark:text-slate-300 text-lg leading-relaxed placeholder-slate-200 dark:placeholder-slate-800"
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                  >
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">{activeNote.title || 'Untitled Note'}</h1>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-8" />
                    {renderPreview(activeNote.content)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto animate-bounce duration-1000">
                <FileText size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Select a note</h3>
                <p className="text-slate-400 text-sm font-medium">Or create a new one to begin</p>
              </div>
              <button 
                onClick={createNote}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20"
              >
                Create First Note
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

