import React, { useState, useMemo } from 'react';
import { Software, Category, SiteSettings } from '../types';
import { SoftwareCard } from './SoftwareCard';
import { AdsterraAd } from './AdsterraAd';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Shield,
  Zap,
  HardDrive,
  Download,
  Terminal,
  Palette,
  Briefcase,
  ShieldCheck,
  Folder,
  ArrowRight,
  Mail,
  Send,
} from 'lucide-react';

interface MarketplaceHomeProps {
  softwareList: Software[];
  categories: Category[];
  siteSettings: SiteSettings | null;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
  pricingFilter: 'all' | 'free' | 'paid';
  setPricingFilter: (filter: 'all' | 'free' | 'paid') => void;
  onSelectSoftware: (software: Software) => void;
  onDownloadSoftware: (software: Software) => void;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  Terminal,
  Palette,
  Briefcase,
  ShieldCheck,
  Folder,
};

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  softwareList,
  categories,
  siteSettings,
  selectedCategorySlug,
  setSelectedCategorySlug,
  pricingFilter,
  setPricingFilter,
  onSelectSoftware,
  onDownloadSoftware,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'name'>('popular');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filtered software list
  const filteredSoftware = useMemo(() => {
    return softwareList
      .filter((s) => s.is_published)
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.short_description.toLowerCase().includes(q) ||
          s.developer_name.toLowerCase().includes(q) ||
          s.platform.toLowerCase().includes(q) ||
          (s.category_name && s.category_name.toLowerCase().includes(q))
        );
      })
      .filter((s) => {
        if (selectedCategorySlug === 'all') return true;
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        return cat ? s.category_id === cat.id : true;
      })
      .filter((s) => {
        if (pricingFilter === 'free') return !s.is_paid;
        if (pricingFilter === 'paid') return s.is_paid;
        return true;
      })
      .filter((s) => {
        if (platformFilter === 'all') return true;
        return s.platform.toLowerCase().includes(platformFilter.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.download_count - a.download_count;
        if (sortBy === 'latest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [softwareList, categories, searchQuery, selectedCategorySlug, pricingFilter, platformFilter, sortBy]);

  // Section subsets
  const featuredList = useMemo(() => {
    return softwareList.filter((s) => s.is_published && s.is_featured);
  }, [softwareList]);

  const latestList = useMemo(() => {
    return [...softwareList]
      .filter((s) => s.is_published)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [softwareList]);

  const popularList = useMemo(() => {
    return [...softwareList]
      .filter((s) => s.is_published)
      .sort((a, b) => b.download_count - a.download_count)
      .slice(0, 4);
  }, [softwareList]);

  const freeList = useMemo(() => {
    return softwareList.filter((s) => s.is_published && !s.is_paid).slice(0, 4);
  }, [softwareList]);

  const paidList = useMemo(() => {
    return softwareList.filter((s) => s.is_published && s.is_paid).slice(0, 4);
  }, [softwareList]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  const isFiltering = searchQuery.trim() !== '' || selectedCategorySlug !== 'all' || pricingFilter !== 'all' || platformFilter !== 'all';

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span>Curated Software Repository & Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight" style={{ textWrap: 'balance' }}>
            {siteSettings?.hero_headline || 'Discover the Best Software for Your Needs'}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {siteSettings?.hero_subheadline ||
              'Vetted developer tools, productivity suites, system utilities, and creative software with verified high-speed downloads.'}
          </p>

          {/* 2. LIVE SEARCH BAR */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg shadow-blue-500/5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-2 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="w-5 h-5 ml-3 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, IDEs, VPNs, design software, or developers..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick search keywords */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
              <span className="text-slate-400">Popular:</span>
              {['CodeSphere', 'Blender', 'NeuroGraph', 'WireGuard', 'Docker'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADSTERRA HOMEPAGE TOP PLACEMENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdsterraAd slotKey="homepage_top" />
      </div>

      {/* 3. CATEGORY TAXONOMY FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategorySlug('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategorySlug === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategorySlug(c.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategorySlug === c.slug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Platform & Pricing Filter Segmented Controls */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            {/* Free vs Paid Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setPricingFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  pricingFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPricingFilter('free')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  pricingFilter === 'free' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setPricingFilter('paid')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  pricingFilter === 'paid' ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                Paid
              </button>
            </div>

            {/* Platform Dropdown */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Recently Added</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </section>

      {/* FILTERED RESULTS VIEW (When searching or filtering) */}
      {isFiltering ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Catalog Search Results
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing {filteredSoftware.length} matching software items
              </p>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategorySlug('all');
                setPricingFilter('all');
                setPlatformFilter('all');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>

          {filteredSoftware.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No software matching your criteria
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try loosening your search terms or selecting a different platform or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSoftware.map((item) => (
                <SoftwareCard
                  key={item.id}
                  software={item}
                  onSelect={onSelectSoftware}
                  onDownload={onDownloadSoftware}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* STANDARD SECTIONAL HOMEPAGE (When not actively filtering) */
        <div className="space-y-16">
          {/* 4. FEATURED SOFTWARE SECTION */}
          {featuredList.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Featured Software</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Hand-picked developer favorites and flagship productivity powerhouses
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredList.map((item) => (
                  <SoftwareCard
                    key={item.id}
                    software={item}
                    onSelect={onSelectSoftware}
                    onDownload={onDownloadSoftware}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 5. SOFTWARE CATEGORIES SHOWCASE TILES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Software Categories</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Browse application suites structured by engineering workflows
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const IconComponent = CATEGORY_ICON_MAP[cat.icon] || Folder;
                const count = softwareList.filter((s) => s.category_id === cat.id && s.is_published).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{count} tools</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ADSTERRA HOMEPAGE MIDDLE BANNER */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdsterraAd slotKey="homepage_middle" />
          </div>

          {/* 6. LATEST SOFTWARE SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latest Software Releases</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recently published software updates and freshly released applications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestList.map((item) => (
                <SoftwareCard
                  key={item.id}
                  software={item}
                  onSelect={onSelectSoftware}
                  onDownload={onDownloadSoftware}
                />
              ))}
            </div>
          </section>

          {/* 7. POPULAR SOFTWARE SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Most Popular Downloads</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Frequently downloaded software ranked by developer adoption
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularList.map((item) => (
                <SoftwareCard
                  key={item.id}
                  software={item}
                  onSelect={onSelectSoftware}
                  onDownload={onDownloadSoftware}
                />
              ))}
            </div>
          </section>

          {/* 8. FREE SOFTWARE SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Free & Open Source Applications</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Zero Subscriptions
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ready for direct verified download with zero payment friction
                </p>
              </div>
              <button
                onClick={() => setPricingFilter('free')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View all free tools
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {freeList.map((item) => (
                <SoftwareCard
                  key={item.id}
                  software={item}
                  onSelect={onSelectSoftware}
                  onDownload={onDownloadSoftware}
                />
              ))}
            </div>
          </section>

          {/* 9. PAID COMMERCIAL SOFTWARE SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Commercial & Enterprise Software</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    Payment Gateway Coming Soon
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High-performance professional suites prepared for upcoming Stripe, bKash & Nagad checkout
                </p>
              </div>
              <button
                onClick={() => setPricingFilter('paid')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View all commercial tools
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paidList.map((item) => (
                <SoftwareCard
                  key={item.id}
                  software={item}
                  onSelect={onSelectSoftware}
                  onDownload={onDownloadSoftware}
                />
              ))}
            </div>
          </section>

          {/* ADSTERRA HOMEPAGE BOTTOM BANNER */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdsterraAd slotKey="homepage_bottom" />
          </div>

          {/* 10. WHY CHOOSE US SECTION */}
          <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 sm:p-12 shadow-xs">
              <div className="max-w-2xl mb-10">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Engineering Standards
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  Why Software Engineers Trust Our Marketplace
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  We bridge open-source integrity with enterprise reliability. Every binary is verified, clean, and tested.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified Clean Binaries
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Zero adware, bundled installers, or unwanted toolbars. Every upload undergoes automated hash checks and origin validation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    High-Speed Direct Mirrors
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Download directly through official HTTPS sources and Google Drive mirrors with full SSL bandwidth and zero throttling.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Developer First Taxonomy
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Clear version history, explicit hardware requirements, and clean architecture tags to help you install with confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 11. NEWSLETTER SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold">Stay Ahead of Modern Tooling</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Get a monthly digest of vetted open-source releases, developer utility updates, and benchmark reports.
                </p>

                {newsletterSubscribed ? (
                  <div className="mt-6 p-3 bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thank you for subscribing! Your email is confirmed.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="engineer@company.com"
                      required
                      className="flex-1 px-4 py-2.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Subscribe</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
