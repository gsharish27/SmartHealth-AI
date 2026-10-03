import React from 'react';
import { Activity, ShieldCheck, Lock } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Form Wrapper */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-soft-sm font-bold">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-blue-800 dark:from-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
              PulsePulse SaaS
            </span>
          </div>

          {children}
        </div>
      </div>

      {/* Right Column: Hero SaaS Visual */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md w-max text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>HIPAA & GDPR Compliant Security</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Commercial-Grade Digital Health Monitoring Platform
          </h2>
          <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
            Track vital trends in real-time with automated threshold alerts, multi-doctor access control, and high-performance server pagination.
          </p>
        </div>

        <div className="relative z-10 text-xs text-sky-200/80 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> 256-bit Bank-Grade JWT Encryption Protocol
        </div>
      </div>
    </div>
  );
}
