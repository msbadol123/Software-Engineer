import React, { useState } from 'react';
import {
  getSupabaseCredentials,
  saveCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
  isSupabaseConnected,
} from '../lib/supabase';
import {
  Database,
  X,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onCredentialsUpdated,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql' | 'admin-setup'>('connect');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedAdminCmd, setCopiedAdminCmd] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const connected = isSupabaseConnected();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      alert('Please provide both Supabase URL and Anon Key.');
      return;
    }
    saveCustomSupabaseCredentials(url, anonKey);
    setSaveStatus('Credentials updated! Reloading Supabase connection...');
    setTimeout(() => {
      onCredentialsUpdated();
      setSaveStatus(null);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    clearCustomSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    onCredentialsUpdated();
    setSaveStatus('Switched back to local seeded persistent store.');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const copySqlMigration = () => {
    const sqlText = `-- Software Engineer Supabase Migration
-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Code',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.software (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0.0',
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    platform TEXT NOT NULL DEFAULT 'Cross-Platform',
    system_requirements TEXT,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    price NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    developer_name TEXT NOT NULL DEFAULT 'Independent Developer',
    developer_url TEXT,
    thumbnail_url TEXT NOT NULL,
    download_url TEXT,
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    software_id UUID NOT NULL REFERENCES public.software(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    download_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ads_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_key TEXT NOT NULL UNIQUE,
    slot_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    ad_type TEXT NOT NULL DEFAULT 'banner_728x90',
    zone_id TEXT,
    ad_script TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Full schema also available in /supabase/schema.sql
`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyAdminPromotionCommand = () => {
    const cmd = `SELECT public.promote_user_to_admin('your-email@example.com');`;
    navigator.clipboard.writeText(cmd);
    setCopiedAdminCmd(true);
    setTimeout(() => setCopiedAdminCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Supabase PostgreSQL Integration
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.2 rounded ${
                  connected
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}
              >
                {connected ? 'Live Connected to Supabase' : 'Active (Local Persistent Mode)'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 text-xs">
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
              activeTab === 'connect'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
              activeTab === 'sql'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            SQL Migration
          </button>
          <button
            onClick={() => setActiveTab('admin-setup')}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${
              activeTab === 'admin-setup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Admin Setup
          </button>
        </div>

        {saveStatus && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Tab 1: Connect Form */}
        {activeTab === 'connect' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Found in Supabase Dashboard &gt; Project Settings &gt; API
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Public Anon Key
              </label>
              <textarea
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                rows={3}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset to Seeded Local Mode
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Migration */}
        {activeTab === 'sql' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Copy this schema and execute it in your Supabase SQL Editor. It generates tables, triggers,
              Row Level Security policies, and audit indices.
            </p>

            <div className="relative">
              <pre className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800 leading-tight">
{`-- Execute in Supabase SQL Editor
-- Full script also saved in supabase/schema.sql
CREATE TABLE public.profiles (...);
CREATE TABLE public.admins (...);
CREATE TABLE public.categories (...);
CREATE TABLE public.software (...);
CREATE TABLE public.downloads (...);
CREATE TABLE public.ads_settings (...);`}
              </pre>

              <button
                onClick={copySqlMigration}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              Complete migration file available at <span className="font-mono text-slate-700 dark:text-slate-300">/supabase/schema.sql</span>.
            </div>
          </div>
        )}

        {/* Tab 3: Admin Account Setup */}
        {activeTab === 'admin-setup' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>How to Create Your First Admin</span>
            </h3>

            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Sign up with your email via the marketplace registration modal.</li>
              <li>Open your Supabase Project dashboard &gt; <strong>SQL Editor</strong>.</li>
              <li>Execute the admin promotion procedure using your registered email:</li>
            </ol>

            <div className="relative">
              <div className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
                SELECT public.promote_user_to_admin(&apos;your-email@example.com&apos;);
              </div>
              <button
                onClick={copyAdminPromotionCommand}
                className="absolute top-2.5 right-2 flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAdminCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              This safely grants the <code className="font-mono text-blue-500">super_admin</code> role to that user without exposing database keys in client code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
