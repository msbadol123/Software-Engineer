import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or custom local storage override
export function getSupabaseCredentials(): { url: string; anonKey: string; isCustom: boolean } {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('software_engineer_supabase_url') : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('software_engineer_supabase_key') : null;

  if (customUrl && customKey) {
    return { url: customUrl, anonKey: customKey, isCustom: true };
  }

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    isCustom: false,
  };
}

let cachedClient: SupabaseClient | null = null;
let cachedKeySignature = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || url === 'https://your-project-id.supabase.co' || anonKey === 'your-anon-key-here') {
    return null;
  }

  const signature = `${url}::${anonKey}`;
  if (cachedClient && cachedKeySignature === signature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedKeySignature = signature;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('software_engineer_supabase_url', url.trim());
    localStorage.setItem('software_engineer_supabase_key', anonKey.trim());
    cachedClient = null;
    cachedKeySignature = '';
  }
}

export function clearCustomSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('software_engineer_supabase_url');
    localStorage.removeItem('software_engineer_supabase_key');
    cachedClient = null;
    cachedKeySignature = '';
  }
}

export function isSupabaseConnected(): boolean {
  return getSupabaseClient() !== null;
}
