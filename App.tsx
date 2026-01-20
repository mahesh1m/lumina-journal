
import React, { useState, useEffect, useCallback } from 'react';
import { User, JournalEntry } from './types';
import { storageService } from './services/storageService';
import { supabase } from './services/supabaseClient';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import JournalList from './components/JournalList';
import JournalEditor from './components/JournalEditor';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await storageService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await fetchEntries(currentUser.id);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        const authedUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name
        };
        setUser(authedUser);
        await fetchEntries(authedUser.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setEntries([]);
        setView('list');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEntries = async (userId: string) => {
    try {
      const fetched = await storageService.getEntries(userId);
      setEntries(fetched);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  };

  const handleAuthSuccess = useCallback(async (authedUser: User) => {
    setUser(authedUser);
    await fetchEntries(authedUser.id);
    setView('list');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await storageService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  const handleNewEntry = useCallback(() => {
    setEditingEntry(null);
    setView('editor');
  }, []);

  const handleEditEntry = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setView('editor');
  }, []);

  const handleSaveEntry = useCallback(async (entry: JournalEntry) => {
    try {
      await storageService.saveEntry(entry);
      if (user) {
        await fetchEntries(user.id);
      }
      setView('list');
    } catch (err: any) {
      console.error("Failed to save entry:", err);
      const msg = err?.message || JSON.stringify(err);
      alert(`Error saving entry: ${msg}`);
    }
  }, [user]);

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await storageService.deleteEntry(entryId);
        if (user) {
          await fetchEntries(user.id);
        }
      } catch (err: any) {
        console.error("Failed to delete entry:", err);
        const msg = err?.message || JSON.stringify(err);
        alert(`Error deleting entry: ${msg}`);
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg mb-4 flex items-center justify-center">
             <span className="text-white font-bold">L</span>
          </div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {!user ? (
        <div className="flex flex-col items-center py-12">
          <div className="text-center mb-12 max-w-2xl px-4">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
               <span className="text-white font-bold text-3xl">L</span>
             </div>
             <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
               Your Mind, <span className="text-indigo-600">Illuminated.</span>
             </h1>
             <p className="text-xl text-slate-500 mb-8 font-serif italic">
               A secure sanctuary for your deepest reflections, enhanced by AI clarity and cloud backup.
             </p>
          </div>
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {view === 'list' ? (
            <JournalList
              entries={entries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
              onNew={handleNewEntry}
            />
          ) : (
            <JournalEditor
              user={user}
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={() => setView('list')}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
