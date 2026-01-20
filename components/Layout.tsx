
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lumina</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-slate-500">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Lumina Journal. Securely stored on your device.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
