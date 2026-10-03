import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Sign In to Dashboard</h2>
        <p className="text-xs text-muted-foreground">Enter your credentials to access your health portal</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Credentials Info Pill */}
      <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
        <p className="font-bold text-sky-700 dark:text-sky-300">Demo Accounts Available:</p>
        <p className="text-muted-foreground">
          Patient: <code className="text-foreground font-semibold">john.doe@example.com</code> / <code className="text-foreground font-semibold">Password123!</code>
        </p>
        <p className="text-muted-foreground">
          Doctor: <code className="text-foreground font-semibold">dr.smith@example.com</code> / <code className="text-foreground font-semibold">Password123!</code>
        </p>
        <p className="text-muted-foreground">
          Admin: <code className="text-foreground font-semibold">admin@example.com</code> / <code className="text-foreground font-semibold">Password123!</code>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-soft-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-sky-600 hover:underline">
          Create Patient Profile
        </Link>
      </p>
    </AuthLayout>
  );
}
