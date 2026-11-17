import React, { useState, useEffect } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HeroReferenceSection } from './components/HeroReferenceSection.tsx';
import { PropertyCard } from './components/PropertyCard.tsx';
import { PropertySearchPanel } from './components/PropertySearchPanel.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { ComparisonView } from './components/ComparisonView.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AgentDashboard } from './components/AgentDashboard.tsx';
import { FinancialCalculators } from './components/FinancialCalculators.tsx';
import { HomeSections } from './components/HomeSections.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { Property } from './types/index.ts';
import { ArrowUp, Shield, Briefcase, Eye } from 'lucide-react';

function AppContent() {
  const {
    activeView,
    setActiveView,
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    currentUser,
    switchUserRole
  } = useRealEstate();

  const [searchLayout, setSearchLayout] = useState<'grid' | 'list'>('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Monitor scroll for Back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize browser URL paths (/admin/login, /admin/dashboard, etc.)
  useEffect(() => {
    const handleUrlRoute = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin/login') {
        setActiveView('admin_login');
      } else if (path === '/admin' || path === '/admin/dashboard') {
        if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
          setActiveView('admin_dash');
        } else {
          setActiveView('admin_login');
        }
      } else if (path === '/search') {
        setActiveView('search');
      } else if (path === '/compare') {
        setActiveView('compare');
      } else if (path === '/customer' || path === '/dashboard') {
        setActiveView('customer_dash');
      } else if (path === '/agent') {
        setActiveView('agent_dash');
      } else if (path === '/calculators') {
        setActiveView('calculators');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [currentUser.role, setActiveView]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetailModal = (prop: Property) => {
    setSelectedProperty(prop);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e7e3dc] dark:bg-[#0b0f17] text-[#1c1c1e] dark:text-[#f3f4f6] transition-colors duration-300">
      {/* Role Banner if in Admin or Agent mode */}
      {currentUser.role !== 'customer' && (
        <div className="bg-[#2e1d6d] text-white py-1.5 px-4 text-xs font-medium flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            {currentUser.role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Briefcase className="w-3.5 h-3.5 text-purple-300" />
            )}
            <span>
              Active in <strong className="uppercase">{currentUser.role} Mode</strong> as {currentUser.name}
            </span>
          </div>
          <button
            onClick={() => {
              switchUserRole('customer');
              setActiveView('home');
            }}
            className="underline hover:text-purple-200 text-[11px]"
          >
            Exit to Marketplace View →
          </button>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navigation />

      {/* Main Content Render Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            {/* The Landmark Hero Reference Section */}
            <HeroReferenceSection />

            {/* Quick Explore / Search Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <PropertySearchPanel
                layout={searchLayout}
                setLayout={setSearchLayout}
                resultCount={filteredProperties.length}
              />

              <div className="mt-8">
                {filteredProperties.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      No matching residences found
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try widening your budget or clearing location filters.
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      searchLayout === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'flex flex-col gap-5'
                    }
                  >
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        layout={searchLayout}
                        onScheduleVisit={handleOpenDetailModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Auxiliary Content: Featured, Why Choose Us, Sold, Testimonials, Footer */}
            <HomeSections />
          </div>
        )}

        {activeView === 'search' && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="pb-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Extraordinary Real Estate Directory
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Explore fully verified luxury homes, sky penthouses, and commercial headquarters.
              </p>
            </div>

            <PropertySearchPanel
              layout={searchLayout}
              setLayout={setSearchLayout}
              resultCount={filteredProperties.length}
            />

            {filteredProperties.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No properties match your current criteria
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust filters or reset search parameters to browse all listings.
                </p>
              </div>
            ) : (
              <div
                className={
                  searchLayout === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-5'
                }
              >
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    layout={searchLayout}
                    onScheduleVisit={handleOpenDetailModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'details' && selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setActiveView('home')}
          />
        )}

        {activeView === 'compare' && <ComparisonView />}

        {activeView === 'customer_dash' && <CustomerDashboard />}

        {activeView === 'admin_login' && (
          <AdminLogin
            onSuccess={() => setActiveView('admin_dash')}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'admin_dash' && (
          currentUser.role === 'admin' || currentUser.role === 'super_admin' ? (
            <AdminDashboard />
          ) : (
            <AdminLogin
              onSuccess={() => setActiveView('admin_dash')}
              onBackToHome={() => setActiveView('home')}
            />
          )
        )}

        {activeView === 'agent_dash' && <AgentDashboard />}

        {activeView === 'calculators' && <FinancialCalculators />}
      </main>

      {/* Floating Property Detail Modal when triggered from cards */}
      {isDetailModalOpen && selectedProperty && activeView !== 'details' && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-slate-900/80 dark:bg-white/80 text-white dark:text-slate-900 backdrop-blur-md shadow-lg hover:scale-105 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RealEstateProvider>
      <AppContent />
    </RealEstateProvider>
  );
}
