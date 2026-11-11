import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Shield,
  User as UserIcon,
  LogOut,
  Download,
  Menu,
  X,
  Database,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenSupabaseModal: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  onCategorySelect?: (slug: string) => void;
  onPricingFilter?: (pricing: 'all' | 'free' | 'paid') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onOpenSupabaseModal,
  currentView,
  setCurrentView,
  onPricingFilter,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean text element) */}
        <button
          onClick={() => {
            setCurrentView('marketplace');
            if (onPricingFilter) onPricingFilter('all');
          }}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            SE
          </div>
          <span>Software Engineer</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('all');
            }}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              currentView === 'marketplace' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            Explore Catalog
          </button>
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('free');
            }}
            className="whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Free Software
          </button>
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('paid');
            }}
            className="whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Commercial Suites
          </button>
          <a
            href="#why-us"
            onClick={(e) => {
              if (currentView !== 'marketplace') {
                e.preventDefault();
                setCurrentView('marketplace');
                setTimeout(() => {
                  document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Why Choose Us
          </a>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Supabase status / config trigger */}
          <button
            onClick={onOpenSupabaseModal}
            title="Supabase Database Connection"
            className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin link */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Auth Button or User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <span className="max-w-[100px] truncate">{user.full_name || user.email.split('@')[0]}</span>
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                    {(user.full_name || user.email)[0].toUpperCase()}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user.full_name || 'Software Engineer User'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={onOpenDashboard}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Dashboard & Profile</span>
                  </button>

                  <button
                    onClick={onOpenDashboard}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download History</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={onOpenAdmin}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Management</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => logout()}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/10 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('all');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
          >
            All Software
          </button>
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('free');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
          >
            Free Downloads
          </button>
          <button
            onClick={() => {
              setCurrentView('marketplace');
              if (onPricingFilter) onPricingFilter('paid');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
          >
            Commercial Software
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
