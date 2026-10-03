import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold shadow-soft-md mb-4">
        <Activity className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-muted-foreground max-w-sm mt-2 mb-6">
        The requested health telemetry view or portal endpoint does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-soft-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
