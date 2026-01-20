
import React, { useState, useEffect } from 'react';
import { JournalEntry, User } from '../types';
import { generateJournalInsights, suggestTitleAndMood } from '../services/geminiService';

interface JournalEditorProps {
  user: User;
  entry?: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or insecure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const JournalEditor: React.FC<JournalEditorProps> = ({ user, entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mood, setMood] = useState(entry?.mood || '');
  const [insights, setInsights] = useState(entry?.aiInsights || '');

  const handleAISuggest = async () => {
    if (!content.trim()) return;
    setIsGenerating(true);
    try {
      const [newInsights, suggestions] = await Promise.all([
        generateJournalInsights(content),
        suggestTitleAndMood(content)
      ]);
      setInsights(newInsights);
      if (!title) setTitle(suggestions.title);
      if (!mood) setMood(suggestions.mood);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    
    // Ensure we have a valid ID and UserID
    const entryId = entry?.id || generateUUID();
    
    onSave({
      id: entryId,
      userId: user.id,
      title: title || 'Untitled Reflection',
      content,
      mood,
      aiInsights: insights,
      createdAt: entry?.createdAt || now,
      updatedAt: now
    });
  };

  const MOODS = ['Peaceful', 'Anxious', 'Grateful', 'Sad', 'Excited', 'Reflective'];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[85vh] lg:h-[calc(100vh-10rem)] lg:min-h-[600px]">
      {/* Main Editor Section */}
      <div className="flex-grow p-5 sm:p-8 flex flex-col overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-900 flex items-center space-x-2 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Cancel</span>
          </button>
          
          <div className="flex items-center w-full sm:w-auto space-x-2 sm:space-x-3">
             <button
              onClick={handleAISuggest}
              disabled={isGenerating || !content.trim()}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm shadow-indigo-100"
            >
              {isGenerating ? (
                <div className="animate-spin h-4 w-4 border-2 border-indigo-700 border-t-transparent rounded-full" />
              ) : (
                <svg className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4h2.803a1 1 0 01.95 1.103l-1.5 13a1 1 0 01-1.103.897H5.653a1 1 0 01-1.103-.897l-1.5-13A1 1 0 014 4h2.803V1.997a1 1 0 01.897-.95l3.6-.35a1 1 0 011 .35zM9 11a1 1 0 100-2 1 1 0 000 2zm1 4a1 1 0 11-2 0 1 1 0 012 0zm3-4a1 1 0 100-2 1 1 0 000 2zm1 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              )}
              <span>{isGenerating ? 'Thinking...' : 'AI Perspective'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 text-xs sm:text-sm"
            >
              Save
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title your moment..."
          className="w-full text-2xl sm:text-4xl font-bold text-slate-900 border-none focus:ring-0 placeholder-slate-200 mb-6 outline-none tracking-tight"
        />
        
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 w-full sm:w-auto mb-1 sm:mb-0">Mood</span>
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${
                mood === m 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              {m}
            </button>
          ))}
          <input
            type="text"
            value={MOODS.includes(mood) ? '' : mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Custom..."
            className="text-[10px] sm:text-xs bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 focus:ring-2 focus:ring-indigo-100 outline-none w-24 sm:w-32"
          />
        </div>

        <div className="flex-grow flex flex-col relative min-h-[300px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Breathe your thoughts into existence..."
            className="flex-grow w-full resize-none border-none focus:ring-0 placeholder-slate-200 text-slate-700 text-lg sm:text-xl leading-relaxed outline-none font-serif italic min-h-[inherit]"
          />
        </div>
      </div>

      {/* AI Sidebar / Footer on mobile */}
      <div className="w-full lg:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-8 flex flex-col">
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM11 11a1 1 0 10-2 0 1 1 0 002 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">AI Insights</h3>
        </div>
        
        {insights ? (
          <div className="space-y-4 sm:space-y-6 flex-grow">
            <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
              <p className="text-slate-700 leading-relaxed font-serif italic text-base sm:text-lg">
                "{insights}"
              </p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl">
               <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-1">Growth Prompt</p>
               <p className="text-xs sm:text-sm text-indigo-700 italic">How does this moment shape your tomorrow?</p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-8 lg:py-12 px-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
               <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed italic">
              "Your story matters."
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
           <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span>Secure Cloud</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;
