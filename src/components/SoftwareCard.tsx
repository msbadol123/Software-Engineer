import React from 'react';
import { Software } from '../types';
import { Download, ArrowRight, Lock } from 'lucide-react';

interface SoftwareCardProps {
  software: Software;
  onSelect: (software: Software) => void;
  onDownload: (software: Software) => void;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  software,
  onSelect,
  onDownload,
}) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Thumbnail Container */}
      <div
        onClick={() => onSelect(software)}
        className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={software.thumbnail_url}
          alt={software.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Pricing state tag (Clean text badge in corner) */}
        <div className="absolute top-2.5 right-2.5">
          {software.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/20">
              <Lock className="w-2.5 h-2.5" />
              ${software.price.toFixed(2)}
            </span>
          ) : (
            <span className="inline-flex items-center rounded bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/20">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
          <span>{software.platform}</span>
          <span aria-hidden="true">·</span>
          <span>v{software.version}</span>
          {software.category_name && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[120px]">{software.category_name}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(software)}
          className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
        >
          {software.title}
        </h3>

        {/* Short Description */}
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {software.short_description}
        </p>

        {/* Telemetry info: Download counter & developer */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-[130px]">{software.developer_name}</span>
          <span className="font-mono tabular-nums">{software.download_count.toLocaleString()} downloads</span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="grid grid-cols-2 gap-2 p-3 pt-0 bg-white dark:bg-slate-900/90">
        <button
          onClick={() => onSelect(software)}
          className="w-full flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>

        {software.is_paid ? (
          <button
            onClick={() => onSelect(software)}
            className="w-full flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors whitespace-nowrap"
          >
            <Lock className="w-3 h-3" />
            <span>Coming Soon</span>
          </button>
        ) : (
          <button
            onClick={() => onDownload(software)}
            className="w-full flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-sm shadow-blue-500/10 whitespace-nowrap"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
};
