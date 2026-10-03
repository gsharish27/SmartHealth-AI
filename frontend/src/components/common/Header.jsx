import React, { useEffect, useState } from 'react';
import { useAuth } from '../../stores/authContext';
import DarkToggle from './DarkToggle';
import { Bell, Search, Menu, LogOut, ShieldAlert } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Header({ onToggleSidebar }) {
  const { user, logout, hasRole } = useAuth();
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    if (user) {
      axiosClient.get('/alerts/unread-count')
        .then((res) => setUnreadAlerts(res.data))
        .catch(() => setUnreadAlerts(0));
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-30 h-20 px-6 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-slate-400 text-sm w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vitals, records, doctors..."
            className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 text-xs w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasRole('ADMIN') && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin Portal
          </span>
        )}

        <DarkToggle />

        <a
          href="/alerts"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          )}
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
          )}
        </a>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-teal-500/20">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
