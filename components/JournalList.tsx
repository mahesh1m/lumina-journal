
import React from 'react';
import { JournalEntry } from '../types';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const JournalList: React.FC<JournalListProps> = ({ entries, onEdit, onDelete, onNew }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Reflections</h2>
          <p className="text-slate-500 font-serif italic">{entries.length} memories safely preserved</p>
        </div>
        <button
          onClick={onNew}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Write Today</span>
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">The first page is blank...</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-serif italic">"Fill your paper with the breathings of your heart." — William Wordsworth</p>
          <button
            onClick={onNew}
            className="text-indigo-600 font-bold hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4"
          >
            Create your first entry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onEdit(entry)}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow pr-8">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {entry.mood && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {entry.title || 'Untitled'}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed mb-6 font-serif italic">
                {entry.content}
              </p>

              {entry.aiInsights && (
                <div className="pt-4 border-t border-slate-50 flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM11 11a1 1 0 10-2 0 1 1 0 002 0z" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-slate-400 italic leading-snug line-clamp-2">
                    {entry.aiInsights}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
