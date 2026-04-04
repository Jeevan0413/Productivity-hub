import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, FileText, Check } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useLocalStorage('prod-hub-notes', [
    { id: '1', title: 'Welcome', content: 'This is your quick notes space...', updatedAt: Date.now() }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  
  // If notes array is empty and activeNoteId is null but we just added a note, this handles selecting it
  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const createNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
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

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm h-full flex overflow-hidden">
      
      {/* Sidebar for Note List */}
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center">
            <FileText size={18} className="mr-2 text-amber-500" />
            Notes
          </h2>
          <button 
            onClick={createNote}
            className="p-1.5 bg-white dark:bg-gray-700 rounded-md text-gray-500 hover:text-amber-500 shadow-sm border border-gray-100 dark:border-gray-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">No notes yet.</div>
          ) : (
            <div className="flex flex-col">
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer group transition-colors ${
                    activeNoteId === note.id 
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-l-amber-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2">
                      {note.title || 'Untitled'}
                    </h3>
                    <button 
                      onClick={(e) => deleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-2">
                    {note.content || 'No additional text'}
                  </p>
                  <div className="text-[10px] text-gray-400">
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="w-2/3 flex flex-col bg-white dark:bg-gray-800">
        {activeNote ? (
          <div className="flex-1 flex flex-col p-6 h-full">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, 'title', e.target.value)}
              placeholder="Note Title"
              className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 mb-4 placeholder-gray-300 dark:placeholder-gray-600"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, 'content', e.target.value)}
              placeholder="Start typing your note here..."
              className="flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 leading-relaxed placeholder-gray-400 dark:placeholder-gray-500 custom-scrollbar"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col space-y-4">
            <FileText size={48} className="text-gray-300 dark:text-gray-600" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>

    </div>
  );
}
