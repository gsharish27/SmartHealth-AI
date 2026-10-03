import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ fullName, email, password, phoneNumber, role, specialty });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Create Your Account</h2>
        <p className="text-xs text-muted-foreground">Register as a Patient or Medical Physician</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Email Address *</label>
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
          <label className="block font-semibold mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Account Role *</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500 font-medium"
          >
            <option value="ROLE_USER">Patient Account</option>
            <option value="ROLE_DOCTOR">Physician / Doctor Account</option>
          </select>
        </div>

        {role === 'ROLE_DOCTOR' && (
          <div>
            <label className="block font-semibold mb-1">Medical Specialty</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Cardiology, Internal Medicine"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-soft-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register Profile'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-sky-600 hover:underline">
          Sign In Here
        </Link>
      </p>
    </AuthLayout>
  );
}
