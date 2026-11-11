import React, { useState } from 'react';
import { Software } from '../types';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import { AdsterraAd } from './AdsterraAd';
import {
  Download,
  ArrowLeft,
  Calendar,
  Layers,
  Cpu,
  Globe,
  ExternalLink,
  CheckCircle2,
  Lock,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface SoftwareDetailsProps {
  software: Software;
  onBack: () => void;
  onRefreshSoftware?: () => void;
}

export const SoftwareDetails: React.FC<SoftwareDetailsProps> = ({
  software,
  onBack,
  onRefreshSoftware,
}) => {
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState<string>(
    software.screenshots?.[0] || software.thumbnail_url
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isGoogleDrive = software.download_url?.includes('drive.google.com');

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);

    const result = await DataService.executeDownload(software.id, user);

    if (result.success && result.downloadUrl) {
      setDownloadSuccess(true);
      if (onRefreshSoftware) onRefreshSoftware();

      // Open download URL in new tab safely
      setTimeout(() => {
        window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
        setDownloading(false);
      }, 700);
    } else {
      setDownloadError(result.error || 'Failed to initiate download.');
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visuals & Full Description (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual Display */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
            <div className="aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={activeImage}
                alt={software.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Screenshots Thumbnails */}
            {software.screenshots && software.screenshots.length > 1 && (
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-3 overflow-x-auto">
                <button
                  onClick={() => setActiveImage(software.thumbnail_url)}
                  className={`w-20 aspect-video rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === software.thumbnail_url ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={software.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
                {software.screenshots.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(s)}
                    className={`w-20 aspect-video rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === s ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={s} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Overview */}
          <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              About {software.title}
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {software.full_description}
            </div>

            {/* System Requirements */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>System Requirements</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 font-mono leading-normal">
                {software.system_requirements}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Download Card & Specifications (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Purchase / Download Module */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {software.category_name}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {software.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  by {software.developer_name}
                </p>
              </div>

              {software.is_paid ? (
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    ${software.price.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase">
                    Commercial
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    Free
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">
                    Open Access
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {software.short_description}
            </p>

            {/* Download Error Alert */}
            {downloadError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{downloadError}</span>
              </div>
            )}

            {/* Action Buttons */}
            {software.is_paid ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Purchase Not Available Yet</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                    Stripe, bKash, and Nagad payment gateways are currently undergoing integration. Commercial licenses will be available soon.
                  </p>
                </div>
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Direct Download Locked</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {downloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying & Preparing Link...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Download Launched!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Latest v{software.version}</span>
                    </>
                  )}
                </button>

                {isGoogleDrive && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-normal">
                    Hosted on Google Drive. Will open Google Drive file viewer for instant virus-scanned download.
                  </p>
                )}
              </div>
            )}

            {/* Specifications Meta Table */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Platform</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{software.platform}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated</span>
                </span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {new Date(software.updated_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Downloads</span>
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {software.download_count.toLocaleString()}
                </span>
              </div>

              {software.developer_url && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </span>
                  <a
                    href={software.developer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 truncate max-w-[150px]"
                  >
                    <span>Developer Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Adsterra Details Unit */}
          <AdsterraAd slotKey="software_details" />
        </div>
      </div>
    </div>
  );
};
