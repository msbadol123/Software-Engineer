import React, { useEffect, useState, useMemo } from 'react';
import { AdSetting } from '../types';
import { DataService } from '../services/dataService';

interface AdsterraAdProps {
  slotKey: 'homepage_top' | 'homepage_middle' | 'homepage_bottom' | 'software_details' | 'sidebar' | 'footer';
  className?: string;
  showPreviewPlaceholder?: boolean;
}

export const AdsterraAd: React.FC<AdsterraAdProps> = ({
  slotKey,
  className = '',
  showPreviewPlaceholder = false,
}) => {
  // Hook 1: useState
  const [adSetting, setAdSetting] = useState<AdSetting | null>(null);

  // Hook 2: useEffect
  useEffect(() => {
    let mounted = true;
    DataService.getAdsSettings().then((settings) => {
      if (!mounted) return;
      const found = settings.find((s) => s.slot_key === slotKey);
      if (found) setAdSetting(found);
    });
    return () => {
      mounted = false;
    };
  }, [slotKey]);

  // Hook 3: useMemo for dimensions (unconditional)
  const dimensions = useMemo(() => {
    if (!adSetting) return { width: 728, height: 90, cssHeight: '90px', cssWidth: '728px' };

    switch (adSetting.ad_type) {
      case 'banner_300x250':
        return { width: 300, height: 250, cssHeight: '250px', cssWidth: '300px' };
      case 'banner_468x60':
        return { width: 468, height: 60, cssHeight: '60px', cssWidth: '468px' };
      case 'banner_728x90':
      default:
        return { width: 728, height: 90, cssHeight: '90px', cssWidth: '728px' };
    }
  }, [adSetting]);

  // Hook 4: useMemo for iframe content (unconditional)
  const iframeSrcDoc = useMemo(() => {
    if (!adSetting) return null;

    const rawScript = adSetting.ad_script?.trim() || '';
    const hasCustomCode = rawScript.length > 0 && !rawScript.startsWith('/*');
    const hasZoneId = Boolean(
      adSetting.zone_id &&
        adSetting.zone_id.trim() &&
        !adSetting.zone_id.startsWith('demo_')
    );

    let adContent = '';

    if (hasCustomCode) {
      adContent = rawScript;
    } else if (hasZoneId) {
      // Standard Adsterra invocation script format
      adContent = `
        <script type="text/javascript">
          atOptions = {
            'key' : '${adSetting.zone_id.trim()}',
            'format' : 'iframe',
            'height' : ${dimensions.height},
            'width' : ${dimensions.width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.topcreativeformat.com/${adSetting.zone_id.trim()}/invoke.js"></script>
      `;
    }

    if (!adContent) return null;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <base target="_blank" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${adContent}
      </body>
      </html>
    `;
  }, [adSetting, dimensions]);

  // All hooks have completed unconditionally. Now perform early returns if necessary.
  if (!adSetting) {
    return null;
  }

  // If disabled and not showing preview placeholder, render nothing
  if (!adSetting.is_enabled && !showPreviewPlaceholder) {
    return null;
  }

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 p-2 text-center transition-all ${className}`}
      style={{ maxWidth: dimensions.cssWidth, width: '100%' }}
      data-adsterra-slot={slotKey}
    >
      {/* Label Header */}
      <div className="flex items-center justify-between w-full px-2 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
        <span>Advertisement · Adsterra</span>
        <span className={adSetting.is_enabled ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
          {adSetting.is_enabled ? 'Active' : 'Disabled'}
        </span>
      </div>

      {adSetting.is_enabled && iframeSrcDoc ? (
        <div
          className="w-full flex items-center justify-center overflow-hidden rounded-lg bg-transparent"
          style={{ height: dimensions.cssHeight, width: '100%' }}
        >
          <iframe
            title={`Adsterra Ad ${slotKey}`}
            srcDoc={iframeSrcDoc}
            className="w-full h-full border-0 overflow-hidden"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
          />
        </div>
      ) : (
        /* Fallback placeholder when no active code is configured */
        <div
          className="w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4"
          style={{ minHeight: dimensions.cssHeight }}
        >
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {adSetting.slot_name}
          </div>
          <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-1">
            Format: {dimensions.width}×{dimensions.height} ({adSetting.ad_type})
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs">
            {adSetting.is_enabled
              ? 'Paste your Adsterra ad code in Admin Console > Adsterra Ads to activate live delivery.'
              : 'Placement is currently disabled. Toggle ON in Admin Console.'}
          </p>
        </div>
      )}
    </div>
  );
};
