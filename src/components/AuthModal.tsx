import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email, password } : { email, password, name };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      setLoading(false);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  // Quick Demo Auto-fill Credentials
  const fillDemoUser = () => {
    setEmail('demo@aura.com');
    setPassword('user123');
    setMode('login');
  };

  const fillAdminUser = () => {
    setEmail('admin@aura3d.com');
    setPassword('admin123');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Close Modal */}
        <button
          id="close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 mx-auto shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white">
            {mode === 'login' ? 'Sign In to AURA 3D' : 'Create Couture Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Unlock order history tracking, 3D saved configurations, and AuraPoints rewards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            id="auth-tab-login"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-register"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Sarah Connor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="shopper@aura.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 transition-all"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Quick Fill Test Accounts:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="fill-demo-user"
              onClick={fillDemoUser}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 font-mono text-left"
            >
              👤 Demo Customer
            </button>
            <button
              id="fill-admin-user"
              onClick={fillAdminUser}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-purple-300 font-mono text-left"
            >
              🛡️ Store Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
