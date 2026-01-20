
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-lg sm:text-xl">L</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Lumina</h1>
              <span className="hidden sm:inline text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Your personal diary</span>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900">{user.name}</span>
                <span className="text-[10px] text-slate-400">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold text-slate-600 hover:text-white hover:bg-red-500 border border-slate-200 rounded-full transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-5xl w-full mx-auto px-2 sm:px-6 py-4 sm:py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 sm:py-10 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center space-x-2">
               <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
                 <span className="text-white font-bold text-xs">L</span>
               </div>
               <span className="text-sm font-bold text-slate-400">Lumina</span>
            </div>
            <div className="text-center text-slate-400 text-xs sm:text-sm font-medium">
              Created with passion by <span className="text-indigo-600 font-bold">Mahesh Mohan Kumar</span>
            </div>
            <div className="text-slate-300 text-[10px] sm:text-xs">
              &copy; {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
