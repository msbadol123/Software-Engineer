import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DownloadRecord } from '../types';
import { DataService } from '../services/dataService';
import {
  User,
  Download,
  Settings,
  LogOut,
  Calendar,
  Save,
  CheckCircle,
  Clock,
  ArrowLeft,
  Key,
} from 'lucide-react';

interface UserDashboardProps {
  onBack: () => void;
  onSelectSoftwareById?: (id: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onBack, onSelectSoftwareById }) => {
  const { user, profile, updateProfile, logout, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'profile' | 'settings'>('history');
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

  // Profile Edit State
  const [fullName, setFullName] = useState(profile?.full_name || user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || user?.avatar_url || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Password reset message
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoadingDownloads(true);
      DataService.getDownloadsHistory(user.id).then((history) => {
        setDownloads(history);
        setLoadingDownloads(false);
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);

    await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
      bio,
    });

    setSaveLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTriggerPasswordReset = async () => {
    if (!user?.email) return;
    const res = await resetPassword(user.email);
    if (res.success) {
      setResetMessage('A password reset instruction email has been dispatched to ' + user.email);
    } else {
      setResetMessage(res.error || 'Failed to trigger reset email.');
    }
    setTimeout(() => setResetMessage(null), 5000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Please sign in to view your user dashboard and download history.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & User Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your account credentials, security settings, and personal verified download log.
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || 'Profile'}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-2xl font-bold">
              {(user.full_name || user.email)[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile?.full_name || user.full_name || 'Engineer Member'}
            </h2>
            <span className="inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Verified Member
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</p>
          {profile?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-xl">{profile.bio}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="block text-[10px] uppercase text-slate-400">Total Downloads</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {downloads.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg max-w-md mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download History ({downloads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab 1: Download History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Download Log</h3>
            <span className="text-xs text-slate-400 font-mono">Server Validated Records</span>
          </div>

          {loadingDownloads ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading download history...</div>
          ) : downloads.length === 0 ? (
            <div className="p-12 text-center">
              <Download className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No downloads recorded yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Explore the software catalog and download verified developer tools to see them logged here.
              </p>
              <button
                onClick={onBack}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Explore Software
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Software</th>
                    <th className="py-3 px-6">Version</th>
                    <th className="py-3 px-6">Download Date</th>
                    <th className="py-3 px-6">Validation Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {downloads.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {item.software_thumbnail && (
                            <img
                              src={item.software_thumbnail}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-md object-cover bg-slate-100 dark:bg-slate-800"
                            />
                          )}
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.software_title || 'Software Asset'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-500 dark:text-slate-400">
                        v{item.software_version || '1.0.0'}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(item.download_date).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Free</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {onSelectSoftwareById && (
                          <button
                            onClick={() => onSelectSoftwareById(item.software_id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Edit Profile</h3>

          {saveSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Developer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Developer Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description of your skills, tech stack, or interests..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saveLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Account Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Security & Authentication</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your password and security credentials.
            </p>
          </div>

          {resetMessage && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs">
              {resetMessage}
            </div>
          )}

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-500" />
                <span>Password Reset</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Trigger a secure password reset link to your registered email address.
              </p>
            </div>
            <button
              onClick={handleTriggerPasswordReset}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
            >
              Send Reset Link
            </button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Account Meta</h4>
            <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div>Account ID: <span className="text-slate-700 dark:text-slate-300">{user.id}</span></div>
              <div>Role: <span className="text-slate-700 dark:text-slate-300">{user.role || 'user'}</span></div>
              <div>Auth Provider: <span className="text-slate-700 dark:text-slate-300">Supabase Auth</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
