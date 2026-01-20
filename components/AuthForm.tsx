
import React, { useState } from 'react';
import { AuthMode, User } from '../types';
import { storageService } from '../services/storageService';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const user = await storageService.signUp(email, password, name);
        onAuthSuccess(user);
      } else {
        const user = await storageService.signIn(email, password);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Join Lumina'}
        </h2>
        <p className="text-slate-500">
          {mode === 'login' 
            ? 'Sign in to your personal sanctuary.' 
            : 'Start your journaling journey today.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
              placeholder="Alex Smith"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4 disabled:opacity-70 flex items-center justify-center space-x-2"
        >
          {isSubmitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
          <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
