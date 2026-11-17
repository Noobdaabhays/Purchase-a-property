import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Sun,
  Moon,
  Heart,
  Bell,
  Search,
  Command,
  User,
  SlidersHorizontal,
  Layers,
  Calculator,
  Shield,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Download
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

export function Navigation() {
  const {
    isDarkMode,
    toggleTheme,
    currentUser,
    switchUserRole,
    wishlistIds,
    comparisonIds,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeView,
    setActiveView,
    updateFilter,
    openAuthModal,
    logoutUser,
    setIsCommandPaletteOpen
  } = useRealEstate();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: typeof activeView, listingType?: 'buy' | 'rent') => {
    setActiveView(view);
    if (listingType) {
      updateFilter('listingType', listingType);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#f4f2ee]/85 dark:bg-[#0c101a]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2e1d6d] to-[#4c2fbb] flex items-center justify-center text-white font-bold text-lg shadow-sm tracking-tighter">
                A
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                  AURA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                  Real Estate
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeView === 'home' ? 'text-slate-950 dark:text-white font-semibold' : ''
              }`}
            >
              Home
              {activeView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4c2fbb] dark:bg-purple-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('search', 'buy')}
              className={`hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeView === 'search' ? 'text-slate-950 dark:text-white font-semibold' : ''
              }`}
            >
              Buy Properties
            </button>

            <button
              onClick={() => handleNavClick('search', 'rent')}
              className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Rent
            </button>

            <button
              onClick={() => handleNavClick('compare')}
              className={`hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 ${
                activeView === 'compare' ? 'text-slate-950 dark:text-white font-semibold' : ''
              }`}
            >
              <span>Compare</span>
              {comparisonIds.length > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 bg-[#4c2fbb] text-white rounded-full font-mono">
                  {comparisonIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('calculators')}
              className={`hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1 ${
                activeView === 'calculators' ? 'text-slate-950 dark:text-white font-semibold' : ''
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculators</span>
            </button>
          </nav>

          {/* Zone 3: Interactive Affordances & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick search / Command palette button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Open search command palette"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-slate-500 dark:text-slate-400">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/70 dark:bg-black/40 text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('customer_dash')}
              className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="View Wishlist"
              title="Saved Properties"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4c2fbb] ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadNotifCount > 0 && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {unreadNotifCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-[#4c2fbb] dark:text-purple-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`py-3 px-2 rounded-xl text-left cursor-pointer transition-colors ${
                            notif.isRead ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-purple-50/50 dark:bg-purple-950/20'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Direct InfinityFree ZIP Download Button */}
            <a
              href="/purchase-a-property-deployment.zip"
              download="purchase-a-property-deployment.zip"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
              title="Download InfinityFree Deployment ZIP Archive (5.1MB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>

            {/* User Profile & Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-black/10 dark:border-white/10"
                aria-label="User account menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden xl:inline text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email || 'Guest User'}</p>
                    <div className="mt-1.5 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                      {currentUser.role}
                    </div>
                  </div>

                  {/* Switch Experience / Role (for testing and multi-role operations) */}
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
                      Switch Role Portal
                    </p>
                    <button
                      onClick={() => {
                        switchUserRole('customer');
                        setActiveView('customer_dash');
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'customer'
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Customer Portal
                      </span>
                      {currentUser.role === 'customer' && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchUserRole('agent');
                        setActiveView('agent_dash');
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'agent'
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" /> Agent CRM Portal
                      </span>
                      {currentUser.role === 'agent' && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        switchUserRole('admin');
                        setActiveView('admin_dash');
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                      </span>
                      {currentUser.role === 'admin' && <span className="text-[10px]">Active</span>}
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col gap-1">
                    {currentUser.id === 'guest' ? (
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#4c2fbb] dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
                      >
                        Sign In / Register
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-[#f4f2ee] dark:bg-[#0c101a] px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleNavClick('home')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('search', 'buy')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                Buy Properties
              </button>
              <button
                onClick={() => handleNavClick('search', 'rent')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                Rent Properties
              </button>
              <button
                onClick={() => handleNavClick('compare')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                Compare ({comparisonIds.length})
              </button>
              <button
                onClick={() => handleNavClick('calculators')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                Calculators
              </button>
              <button
                onClick={() => handleNavClick('customer_dash')}
                className="px-3 py-2 text-left rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                My Account
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs flex items-center gap-1.5"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
