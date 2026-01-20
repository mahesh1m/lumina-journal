
import { User, JournalEntry } from '../types';
import { supabase } from './supabaseClient';

export const storageService = {
  // Auth
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name
    };
  },

  signIn: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.full_name
    };
  },

  // Journal (Database)
  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      mood: row.mood,
      aiInsights: row.ai_insights
    }));
  },

  saveEntry: async (entry: JournalEntry) => {
    const payload = {
      id: entry.id,
      user_id: entry.userId,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      ai_insights: entry.aiInsights,
      updated_at: new Date().toISOString()
    };

    // Use onConflict to ensure it handles existing IDs correctly
    const { error } = await supabase
      .from('entries')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }
  },

  deleteEntry: async (entryId: string) => {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
  }
};
