
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  mood?: string;
  aiInsights?: string;
}

export type AuthMode = 'login' | 'signup';

export interface AppState {
  user: User | null;
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
}
