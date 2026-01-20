
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your Reflections</h2>
          <p className="text-sm sm:text-base text-slate-500 font-serif italic">{entries.length} memories safely preserved</p>
        </div>
        <button
          onClick={onNew}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Write Today</span>
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center mx-2 sm:mx-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">The first page is blank...</h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-sm mx-auto mb-8 font-serif italic">Capture your thoughts, they are worth keeping.</p>
          <button
            onClick={onNew}
            className="text-indigo-600 font-bold hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4"
          >
            Create your first entry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 px-2 sm:px-0">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onEdit(entry)}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group relative active:bg-slate-50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow pr-10">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {entry.mood && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-bold uppercase tracking-wider border border-indigo-100">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {entry.title || 'Untitled'}
                  </h3>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors absolute top-4 right-4 sm:opacity-0 group-hover:opacity-100"
                  title="Delete entry"
                >
                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed mb-6 font-serif italic">
                {entry.content}
              </p>

              {entry.aiInsights && (
                <div className="pt-4 border-t border-slate-100 flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3z" />
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
