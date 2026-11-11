import React from 'react';
import { AdsterraAd } from './AdsterraAd';
import { SiteSettings } from '../types';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

interface FooterProps {
  siteSettings: SiteSettings | null;
  onOpenAdmin: () => void;
  onCategorySelect: (slug: string) => void;
  onPricingFilter: (filter: 'all' | 'free' | 'paid') => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteSettings,
  onOpenAdmin,
  onCategorySelect,
  onPricingFilter,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      {/* Sticky / Footer Adsterra Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdsterraAd slotKey="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
                SE
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                {siteSettings?.site_name || 'Software Engineer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Curated software marketplace and download repository built for developers, system administrators, and creative engineers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings?.social_github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteSettings?.social_twitter || 'https://x.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings?.contact_email || 'contact@softwareengineer.dev'}`}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Contact Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Software Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onPricingFilter('all')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  All Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPricingFilter('free')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Free & Open Source
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPricingFilter('paid')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Commercial Suites
                </button>
              </li>
              <li>
                <a href="#why-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Security Standards
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onCategorySelect('developer-devops')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Developer & DevOps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategorySelect('design-creative-video')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Design & Creative
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategorySelect('productivity-office')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Productivity & Office
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategorySelect('security-privacy-utilities')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Security & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Platform & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-slate-300"
                >
                  Administrator Console (/admin)
                </button>
              </li>
              <li>
                <span className="text-slate-400">Database: Supabase PostgreSQL</span>
              </li>
              <li>
                <span className="text-slate-400">Monetization: Adsterra Engine</span>
              </li>
              <li>
                <span className="text-slate-400">Hosting: Vercel Ready</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Software Engineer. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Clean Binaries Guaranteed</span>
            <span>·</span>
            <span>Zero Adware</span>
            <span>·</span>
            <span>SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
