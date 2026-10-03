import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { 
  Activity, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  Stethoscope, 
  Search,
  Menu,
  ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E5EAF0] bg-white/95 dark:bg-[#121C2D]/95 backdrop-blur-sm transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Logo & Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#687386] hover:text-[#172033] hover:bg-[#F0F4F8] md:hidden transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123B66] text-white shadow-card-sm font-bold">
              <Activity className="w-5 h-5 text-[#16A6A0]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#123B66] dark:text-white font-display">
                SmartHealth <span className="text-[#16A6A0]">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-[#687386] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search health data, vitals, doctors, or reports..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF0] bg-[#F6F8FB] text-[#172033] placeholder-[#687386] focus:outline-none focus:border-[#16A6A0] focus:ring-1 focus:ring-[#16A6A0] transition-colors"
          />
        </div>

        {/* Right Section: Role Badge, Theme, Bell, User Profile */}
        <div className="flex items-center gap-3">
          {hasRole('ROLE_ADMIN') && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-secondary-text font-bold bg-[#123B66]/10 text-[#123B66] dark:text-sky-300 border border-[#123B66]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#123B66]" /> Admin
            </span>
          )}
          {hasRole('ROLE_DOCTOR') && !hasRole('ROLE_ADMIN') && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-secondary-text font-bold bg-[#16A6A0]/10 text-[#11847F] dark:text-[#16A6A0] border border-[#16A6A0]/20">
              <Stethoscope className="w-3.5 h-3.5 text-[#16A6A0]" /> Doctor Portal
            </span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#687386] hover:text-[#172033] hover:bg-[#F0F4F8] dark:hover:bg-[#1E2C42] transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#E5A11A]" />}
          </button>

          {/* Notification Bell */}
          <Link
            to="/alerts"
            className="p-2 rounded-xl text-[#687386] hover:text-[#172033] hover:bg-[#F0F4F8] dark:hover:bg-[#1E2C42] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#D94A4A] rounded-full" />
          </Link>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-[#E5EAF0] dark:bg-[#1E2C42] mx-1" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F0F4F8] dark:hover:bg-[#1E2C42] transition-colors"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.fullName || 'User Avatar'}
                className="w-8 h-8 rounded-lg object-cover border border-[#E5EAF0]"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#172033] dark:text-white leading-tight">{user?.fullName}</span>
                <span className="text-[11px] text-[#687386] font-medium leading-tight">Patient</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#687386] hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121C2D] border border-[#E5EAF0] dark:border-[#1E2C42] shadow-card-md py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-[#E5EAF0] dark:border-[#1E2C42]">
                  <p className="font-bold text-[#172033] dark:text-white truncate">{user?.fullName}</p>
                  <p className="text-[#687386] truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 font-medium text-[#172033] dark:text-white hover:bg-[#F0F4F8] dark:hover:bg-[#1E2C42] transition-colors"
                >
                  <User className="w-4 h-4 text-[#16A6A0]" /> User Profile & Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2 font-medium text-[#D94A4A] hover:bg-[#D94A4A]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
