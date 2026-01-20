
import React, { useState } from 'react';
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
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[calc(100dvh-5rem)] lg:h-[calc(100vh-10rem)] lg:min-h-[600px] mb-10">
      {/* Main Editor Section */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Sticky Action Header - Fixed offset for mobile layout header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 sm:p-6 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-900 flex items-center space-x-1 sm:space-x-2 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-bold">Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
             <button
              onClick={handleAISuggest}
              disabled={isGenerating || !content.trim()}
              className="p-2.5 sm:px-4 sm:py-2 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="animate-spin h-4 w-4 border-2 border-indigo-700 border-t-transparent rounded-full" />
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              <span className="hidden sm:inline">{isGenerating ? 'Thinking...' : 'AI Insights'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 text-xs sm:text-sm disabled:opacity-50"
            >
              Preserve
            </button>
          </div>
        </div>

        <div className="flex-grow p-5 sm:p-8 flex flex-col overflow-y-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title your moment..."
            className="w-full text-2xl sm:text-4xl font-bold text-slate-900 border-none focus:ring-0 placeholder-slate-200 mb-4 sm:mb-6 outline-none tracking-tight bg-transparent"
            style={{ fontSize: '24px' }}
          />
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full sm:w-auto mb-1">Mood</span>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${
                    mood === m 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-slate-400 border-slate-200'
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
                className="text-[10px] sm:text-xs bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 focus:ring-2 focus:ring-indigo-100 outline-none w-24 sm:w-32"
              />
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your story..."
              className="flex-grow w-full resize-none border-none focus:ring-0 placeholder-slate-200 text-slate-700 text-base sm:text-xl leading-relaxed outline-none font-serif italic bg-transparent min-h-[300px]"
              style={{ fontSize: '16px' }} 
            />
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-8 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM11 11a1 1 0 10-2 0 1 1 0 002 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 tracking-tight text-base">AI Reflection</h3>
        </div>
        
        {insights ? (
          <div className="space-y-4 flex-grow">
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
              <p className="text-slate-700 leading-relaxed font-serif italic text-base">
                "{insights}"
              </p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
               <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-1">Growth Prompt</p>
               <p className="text-xs text-indigo-700 italic">How does this moment shape your tomorrow?</p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-8 px-4 opacity-50">
            <svg className="w-10 h-10 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-slate-400 text-xs italic">
              AI analysis will appear here.
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-200">
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
