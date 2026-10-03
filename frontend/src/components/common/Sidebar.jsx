import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Activity,
  BrainCircuit, 
  TrendingUp, 
  Bot, 
  Target, 
  FileCheck2, 
  Settings, 
  Stethoscope, 
  ShieldCheck, 
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { hasRole } = useAuth();

  const mainNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Health Data', path: '/records', icon: Activity },
    { label: 'AI Analysis', path: '/analytics', icon: BrainCircuit },
    { label: 'Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'AI Assistant', path: '/alerts', icon: Bot },
    { label: 'Goals & Routine', path: '/medications', icon: Target },
    { label: 'Medical Reports', path: '/appointments', icon: FileCheck2 },
    { label: 'Settings & Profile', path: '/profile', icon: Settings },
  ];

  if (hasRole('ROLE_DOCTOR') || hasRole('ROLE_ADMIN')) {
    mainNavItems.push({ label: 'Doctor Portal', path: '/doctor-dashboard', icon: Stethoscope });
  }

  if (hasRole('ROLE_ADMIN')) {
    mainNavItems.push({ label: 'Admin Portal', path: '/admin-dashboard', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#172033]/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Application Shell Sidebar */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-40 h-screen md:h-[calc(100vh-4rem)] w-60 border-r border-[#E5EAF0] dark:border-[#1E2C42] bg-white dark:bg-[#121C2D] transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-4">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between md:hidden px-2 pb-2 border-b border-[#E5EAF0]">
              <span className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wider">Navigation</span>
              <button onClick={onClose} className="p-1 rounded-lg text-[#687386] hover:bg-[#F0F4F8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-text transition-all duration-150 ${
                        isActive
                          ? 'bg-[#123B66] text-white font-semibold shadow-card-sm'
                          : 'text-[#687386] hover:text-[#172033] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#1E2C42]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* AI Engine Status Card */}
          <div className="rounded-2xl bg-[#F6F8FB] dark:bg-[#1E2C42] p-3.5 border border-[#E5EAF0] dark:border-[#1E2C42]/60">
            <div className="flex items-center gap-2 text-[#16A6A0] font-bold text-secondary-text mb-1">
              <span className="w-2 h-2 rounded-full bg-[#20A464]" />
              AI Clinical Engine: Online
            </div>
            <p className="text-secondary-text leading-relaxed">
              24/7 continuous health metric analysis synced with cloud telemetry.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
