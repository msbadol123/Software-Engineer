/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MarketplaceHome } from './components/MarketplaceHome';
import { SoftwareDetails } from './components/SoftwareDetails';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { Software, Category, SiteSettings } from './types';
import { DataService } from './services/dataService';

function MarketplaceApp() {
  const { user } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<'marketplace' | 'details' | 'dashboard' | 'admin'>('marketplace');
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Filter States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');

  // Datasets
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [soft, cats, site] = await Promise.all([
        DataService.getSoftwareList(),
        DataService.getCategories(),
        DataService.getSiteSettings(),
      ]);
      setSoftwareList(soft);
      setCategories(cats);
      setSiteSettings(site);
    } catch (err) {
      console.error('Failed to load initial marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check URL hash for direct admin routing (#admin)
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  const handleSelectSoftware = (software: Software) => {
    setSelectedSoftware(software);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSoftwareById = (id: string) => {
    const item = softwareList.find((s) => s.id === id);
    if (item) {
      setSelectedSoftware(item);
      setCurrentView('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownload = async (software: Software) => {
    const result = await DataService.executeDownload(software.id, user);
    if (result.success && result.downloadUrl) {
      await loadData();
      window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(result.error || 'Failed to download software.');
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePricingFilter = (filter: 'all' | 'free' | 'paid') => {
    setPricingFilter(filter);
    setCurrentView('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view as any);
          if (view === 'marketplace') {
            window.location.hash = '';
          }
        }}
        onCategorySelect={handleCategorySelect}
        onPricingFilter={handlePricingFilter}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-500">Loading Software Engineer Repository...</p>
          </div>
        ) : (
          <>
            {currentView === 'marketplace' && (
              <MarketplaceHome
                softwareList={softwareList}
                categories={categories}
                siteSettings={siteSettings}
                selectedCategorySlug={selectedCategorySlug}
                setSelectedCategorySlug={setSelectedCategorySlug}
                pricingFilter={pricingFilter}
                setPricingFilter={setPricingFilter}
                onSelectSoftware={handleSelectSoftware}
                onDownloadSoftware={handleDownload}
              />
            )}

            {currentView === 'details' && selectedSoftware && (
              <SoftwareDetails
                software={selectedSoftware}
                onBack={() => setCurrentView('marketplace')}
                onRefreshSoftware={loadData}
              />
            )}

            {currentView === 'dashboard' && (
              <UserDashboard
                onBack={() => setCurrentView('marketplace')}
                onSelectSoftwareById={handleSelectSoftwareById}
              />
            )}

            {currentView === 'admin' && (
              <AdminPanel
                onBack={() => {
                  setCurrentView('marketplace');
                  window.location.hash = '';
                }}
                onRefreshSoftware={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* Professional Footer */}
      {currentView !== 'admin' && (
        <Footer
          siteSettings={siteSettings}
          onOpenAdmin={() => {
            setCurrentView('admin');
            window.location.hash = 'admin';
          }}
          onCategorySelect={handleCategorySelect}
          onPricingFilter={handlePricingFilter}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Supabase Connection & Migration Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onCredentialsUpdated={loadData}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MarketplaceApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
