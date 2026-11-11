import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, Profile } from '../types';
import { getSupabaseClient } from '../lib/supabase';
import { DataService } from '../services/dataService';

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => void;
  loginAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Check if admin
            const { data: adminRecord } = await supabase
              .from('admins')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();

            const isUserAdmin = Boolean(adminRecord);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
              isAdmin: isUserAdmin,
              role: isUserAdmin ? 'admin' : 'user',
            });

            // Fetch profile
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            if (prof) setProfile(prof as Profile);
          }
        } catch (err) {
          console.warn('Supabase auth session fetch error:', err);
        }
      } else {
        // Retrieve local active session if stored
        try {
          const saved = localStorage.getItem('se_current_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed);
            const profiles = await DataService.getUsers();
            const matching = profiles.find((p) => p.id === parsed.id || p.email === parsed.email);
            if (matching) setProfile(matching);
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('role')
            .eq('user_id', data.user.id)
            .maybeSingle();

          const isUserAdmin = Boolean(adminRecord);
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            isAdmin: isUserAdmin,
            role: isUserAdmin ? 'admin' : 'user',
          };

          setUser(authUser);
          localStorage.setItem('se_current_user', JSON.stringify(authUser));

          const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
          if (prof) setProfile(prof as Profile);

          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Local authentication fallback
    const users = await DataService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const isSystemAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@softwareengineer.dev';

    const localUser: AuthUser = {
      id: existing ? existing.id : `usr-${Date.now()}`,
      email: email.trim(),
      full_name: existing?.full_name || email.split('@')[0],
      avatar_url: existing?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isAdmin: isSystemAdmin,
      role: isSystemAdmin ? 'super_admin' : 'user',
    };

    setUser(localUser);
    localStorage.setItem('se_current_user', JSON.stringify(localUser));

    if (existing) {
      setProfile(existing);
    } else {
      const newProf: Profile = {
        id: localUser.id,
        email: localUser.email,
        full_name: localUser.full_name || 'Software Engineer',
        avatar_url: localUser.avatar_url,
        bio: 'Passionate developer and software enthusiast.',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(newProf);
    }

    setLoading(false);
    return { success: true };
  };

  const signUp = async (email: string, password?: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
            },
          },
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName || email.split('@')[0],
            isAdmin: false,
            role: 'user',
          };
          setUser(authUser);
          localStorage.setItem('se_current_user', JSON.stringify(authUser));
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    }

    return login(email, password);
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('se_current_user');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    // Simulation for demo mode
    return { success: true };
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!profile) return { success: false, error: 'No active profile to update.' };
    const updated: Profile = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setProfile(updated);
    if (user) {
      const updatedUser = {
        ...user,
        full_name: updated.full_name,
        avatar_url: updated.avatar_url,
      };
      setUser(updatedUser);
      localStorage.setItem('se_current_user', JSON.stringify(updatedUser));
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('profiles').update(updates).eq('id', profile.id);
      } catch (err: any) {
        console.warn('Profile Supabase update failed:', err);
      }
    }

    return { success: true };
  };

  const loginAsDemoAdmin = () => {
    login('admin@softwareengineer.dev');
  };

  const loginAsDemoUser = () => {
    login('alex.engineer@example.com');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: user?.isAdmin ?? false,
        login,
        signUp,
        logout,
        resetPassword,
        updateProfile,
        loginAsDemoAdmin,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
