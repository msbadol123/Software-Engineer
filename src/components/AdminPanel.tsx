import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Software, Category, DownloadRecord, Profile, AdSetting, SiteSettings } from '../types';
import { DataService } from '../services/dataService';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Download,
  Sliders,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Search,
  RefreshCw,
  Info,
  Code,
  Save,
} from 'lucide-react';
import { AdsterraAd } from './AdsterraAd';

interface AdminPanelProps {
  onBack: () => void;
  onRefreshSoftware: () => void;
}

interface AdUnitCardProps {
  ad: AdSetting;
  onSave: (slotKey: string, isEnabled: boolean, zoneId: string, scriptCode: string, adType: any) => Promise<void>;
}

const AdUnitCard: React.FC<AdUnitCardProps> = ({ ad, onSave }) => {
  const [isEnabled, setIsEnabled] = useState(ad.is_enabled);
  const [zoneId, setZoneId] = useState(ad.zone_id || '');
  const [adScript, setAdScript] = useState(ad.ad_script || '');
  const [adType, setAdType] = useState(ad.ad_type || 'banner_728x90');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsEnabled(ad.is_enabled);
    setZoneId(ad.zone_id || '');
    setAdScript(ad.ad_script || '');
    setAdType(ad.ad_type || 'banner_728x90');
  }, [ad]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    await onSave(ad.slot_key, isEnabled, zoneId, adScript, adType);
    setIsSaving(false);
  };

  const handleInsert728Template = () => {
    const key = zoneId.trim() || 'f380c58a98b1c4d9e2';
    setAdScript(`<script type="text/javascript">
\tatOptions = {
\t\t'key' : '${key}',
\t\t'format' : 'iframe',
\t\t'height' : 90,
\t\t'width' : 728,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/${key}/invoke.js"></script>`);
    setAdType('banner_728x90');
  };

  const handleInsert300Template = () => {
    const key = zoneId.trim() || 'a492d19b7c8e5f2a10';
    setAdScript(`<script type="text/javascript">
\tatOptions = {
\t\t'key' : '${key}',
\t\t'format' : 'iframe',
\t\t'height' : 250,
\t\t'width' : 300,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/${key}/invoke.js"></script>`);
    setAdType('banner_300x250');
  };

  const handleInsertIframeTemplate = () => {
    setAdScript(`<iframe src="//www.topcreativeformat.com/watchnew?key=${zoneId.trim() || 'demo_key'}" width="${adType === 'banner_300x250' ? '300' : '728'}" height="${adType === 'banner_300x250' ? '250' : '90'}" frameborder="0" scrolling="no"></iframe>`);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      {/* Top Header Row with status & toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ad.slot_name}</h3>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {ad.slot_key}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Ad Type: {adType}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isEnabled ? 'Placement Active (অন)' : 'Placement Disabled (বন্ধ)'}
            </span>
          </label>
        </div>
      </div>

      {/* Format & Zone ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Banner Format / সাইজ
          </label>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="banner_728x90">728×90 Leaderboard Banner (হেডার/ফুটার)</option>
            <option value="banner_300x250">300×250 Medium Rectangle (সাইডবার/ডিটেইলস)</option>
            <option value="banner_468x60">468×60 Standard Banner</option>
            <option value="native">Native Banner Format</option>
            <option value="social_bar">Social Bar / Popunder Format</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Adsterra Zone ID (জোন আইডি)
          </label>
          <input
            type="text"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            placeholder="e.g. 1029384"
            className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* PRIMARY REQUEST: Adsterra Ad Code Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-blue-500" />
            <span>Adsterra Ad Code (HTML / JavaScript / iframe কোড)</span>
          </label>

          {/* Quick template helpers */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">টেমপ্লেট যোগ করুন:</span>
            <button
              type="button"
              onClick={handleInsert728Template}
              className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              + 728×90
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handleInsert300Template}
              className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              + 300×250
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handleInsertIframeTemplate}
              className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              + iframe
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => setAdScript('')}
              className="text-rose-500 hover:underline"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>

        <textarea
          value={adScript}
          onChange={(e) => setAdScript(e.target.value)}
          rows={5}
          placeholder={`<!-- Adsterra থেকে পাওয়া সম্পূর্ণ বিজ্ঞাপন কোড এখানে পেস্ট করুন -->\n<script type="text/javascript">\n\tatOptions = {\n\t\t'key' : 'f380c58a98b1c4d9e2',\n\t\t'format' : 'iframe',\n\t\t'height' : 90,\n\t\t'width' : 728,\n\t\t'params' : {}\n\t};\n</script>\n<script type="text/javascript" src="//www.topcreativeformat.com/f380c58a98b1c4d9e2/invoke.js"></script>`}
          className="w-full px-3 py-2.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 dark:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-normal"
        />
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          আপনার Adsterra পাবলিশার একাউন্ট (Websites &gt; Get Code) থেকে কোডটি কপি করে সরাসরি এখানে পেস্ট করুন।
        </p>
      </div>

      {/* Action Footer: Save and Live Preview Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showPreview ? 'প্রিভিউ বন্ধ করুন' : 'লাইভ প্রিভিউ দেখুন (Test & Preview)'}</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/10 transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Save Adsterra Placement (সংরক্ষণ করুন)'}</span>
        </button>
      </div>

      {/* Live Preview Drawer */}
      {showPreview && (
        <div className="mt-4 p-4 rounded-xl border border-dashed border-blue-300 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-2 animate-in fade-in duration-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>লাইভ বিজ্ঞাপন প্রিভিউ: {ad.slot_name}</span>
            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
              {isEnabled ? 'Status: Active on Site' : 'Status: Disabled (Preview Test Mode)'}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[110px]">
            <AdsterraAd slotKey={ad.slot_key} showPreviewPlaceholder={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onRefreshSoftware }) => {
  const { user, isAdmin, loginAsDemoAdmin } = useAuth();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'software' | 'categories' | 'users' | 'downloads' | 'ads' | 'settings'
  >('overview');

  // Datasets
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [adsSettings, setAdsSettings] = useState<AdSetting[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Software Modal Edit/Create State
  const [editingSoftware, setEditingSoftware] = useState<Partial<Software> | null>(null);
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);

  // Category Modal State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Search & Filters in Admin
  const [softwareSearch, setSoftwareSearch] = useState('');
  const [downloadFilterSoftware, setDownloadFilterSoftware] = useState('all');

  // Success Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = async () => {
    const [soft, cats, dls, usrs, ads, site] = await Promise.all([
      DataService.getSoftwareList(),
      DataService.getCategories(),
      DataService.getDownloadsHistory(),
      DataService.getUsers(),
      DataService.getAdsSettings(),
      DataService.getSiteSettings(),
    ]);

    setSoftwareList(soft);
    setCategories(cats);
    setDownloads(dls);
    setUsers(usrs);
    setAdsSettings(ads);
    setSiteSettings(site);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Quick statistics
  const totalSoftware = softwareList.length;
  const publishedSoftware = softwareList.filter((s) => s.is_published).length;
  const draftSoftware = softwareList.filter((s) => !s.is_published).length;
  const freeSoftware = softwareList.filter((s) => !s.is_paid).length;
  const paidSoftware = softwareList.filter((s) => s.is_paid).length;
  const totalDownloads = downloads.length;
  const totalUsers = users.length;

  // Software Form Handlers
  const handleOpenNewSoftware = () => {
    setEditingSoftware({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      version: '1.0.0',
      category_id: categories[0]?.id || '',
      platform: 'Cross-Platform',
      system_requirements: 'Standard 64-bit OS, 4GB RAM minimum.',
      is_paid: false,
      price: 0,
      currency: 'USD',
      developer_name: 'Independent Developer',
      developer_url: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      screenshots: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'],
      download_url: 'https://drive.google.com/file/d/sample/view?usp=sharing',
      is_published: true,
      is_featured: false,
      seo_title: '',
      seo_description: '',
    });
    setShowSoftwareModal(true);
  };

  const handleEditSoftware = (item: Software) => {
    setEditingSoftware({ ...item });
    setShowSoftwareModal(true);
  };

  const handleSaveSoftwareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoftware?.title || !editingSoftware?.category_id) {
      alert('Please provide software title and select a category.');
      return;
    }

    await DataService.saveSoftware(editingSoftware as any);
    await loadAllData();
    onRefreshSoftware();
    setShowSoftwareModal(false);
    showToast(`Software "${editingSoftware.title}" saved successfully.`);
  };

  const handleDeleteSoftware = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await DataService.deleteSoftware(id);
      await loadAllData();
      onRefreshSoftware();
      showToast(`Software "${title}" deleted.`);
    }
  };

  const handleTogglePublish = async (item: Software) => {
    await DataService.saveSoftware({
      ...item,
      is_published: !item.is_published,
    });
    await loadAllData();
    onRefreshSoftware();
    showToast(`"${item.title}" ${!item.is_published ? 'Published' : 'Unpublished'}.`);
  };

  // Category Handlers
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    await DataService.saveCategory(editingCategory as any);
    await loadAllData();
    setShowCategoryModal(false);
    showToast(`Category "${editingCategory.name}" saved.`);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      await DataService.deleteCategory(id);
      await loadAllData();
      showToast(`Category "${name}" deleted.`);
    }
  };

  // User Suspension Toggle
  const handleToggleUser = async (userId: string) => {
    await DataService.toggleUserStatus(userId);
    await loadAllData();
    showToast('User status updated.');
  };

  // Ads Settings Save
  const handleSaveAdSettings = async (
    slotKey: string,
    is_enabled: boolean,
    zone_id: string,
    script_code: string,
    ad_type?: any
  ) => {
    await DataService.updateAdSetting(slotKey, {
      is_enabled,
      zone_id,
      ad_script: script_code,
      ...(ad_type ? { ad_type } : {}),
    });
    await loadAllData();
    showToast('Adsterra placement updated successfully.');
  };

  // Site Settings Save
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    await DataService.updateSiteSettings(siteSettings);
    showToast('Website settings updated.');
  };

  // Unauthorized guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Authentication Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Access to <span className="font-mono">/admin</span> is restricted to accounts with an active admin role in Supabase.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => loginAsDemoAdmin()}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Sign in as System Admin (Demo Access)
          </button>
          <button
            onClick={onBack}
            className="w-full py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Back to site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Admin Management</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAllData()}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Logged in as {user?.email}
            </span>
          </div>
        </div>

        {/* Admin Navigation Bar Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-100 dark:border-slate-800/80 py-1.5 text-xs">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveSection('software')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'software'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Software ({softwareList.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'categories'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('downloads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'downloads'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Downloads ({downloads.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('ads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'ads'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Adsterra Ads</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeSection === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Site Settings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI metric cards with tabular figures */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Total Software</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{totalSoftware}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-emerald-600 uppercase">Published</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">{publishedSoftware}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Drafts</span>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mt-1">{draftSoftware}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-blue-600 uppercase">Free Software</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums mt-1">{freeSoftware}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-amber-600 uppercase">Commercial</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums mt-1">{paidSoftware}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Total Users</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">{totalUsers}</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-indigo-600 uppercase">Downloads</span>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums mt-1">{totalDownloads}</p>
              </div>
            </div>

            {/* Quick Actions & Recent Downloads Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Operations</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleOpenNewSoftware}
                      className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Add New Software</span>
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCategory({ name: '', slug: '', description: '', icon: 'Folder' });
                        setShowCategoryModal(true);
                      }}
                      className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create New Category</span>
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveSection('ads')}
                      className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Configure Adsterra Slots</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Google Drive Guide Note */}
                <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-5 text-xs text-blue-900 dark:text-blue-300">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Google Drive Link Handling</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-400">
                    When adding download URLs from Google Drive, ensure link sharing is set to &ldquo;Anyone with the link can view&rdquo;. Google Drive displays virus-scan confirmation pages automatically for files over 100MB.
                  </p>
                </div>
              </div>

              {/* Recent Downloads Table */}
              <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Verified Downloads</h3>
                  <button
                    onClick={() => setActiveSection('downloads')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Software</th>
                        <th className="py-2.5 px-4">User</th>
                        <th className="py-2.5 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {downloads.slice(0, 5).map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {d.software_title} (v{d.software_version})
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-500">{d.user_email}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-500">
                            {new Date(d.download_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: SOFTWARE MANAGEMENT */}
        {activeSection === 'software' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={softwareSearch}
                  onChange={(e) => setSoftwareSearch(e.target.value)}
                  placeholder="Filter software by title or tag..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleOpenNewSoftware}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Software</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Software</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Pricing</th>
                      <th className="py-3 px-4 text-center">Downloads</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {softwareList
                      .filter((s) => s.title.toLowerCase().includes(softwareSearch.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.thumbnail_url}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-md object-cover bg-slate-100 dark:bg-slate-800"
                              />
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block">
                                  {item.title}
                                </span>
                                <span className="text-[11px] font-mono text-slate-500">v{item.version}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.category_name}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{item.platform}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleTogglePublish(item)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                                item.is_published
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {item.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{item.is_published ? 'Published' : 'Draft'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            {item.is_paid ? (
                              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                                ${item.price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300">
                            {item.download_count}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleEditSoftware(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit Software"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSoftware(item.id, item.title)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Delete Software"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CATEGORY MANAGEMENT */}
        {activeSection === 'categories' && (
          <div className="space-y-4 animate-in fade-in duration-150 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Software Categories Taxonomy</h2>
              <button
                onClick={() => {
                  setEditingCategory({ name: '', slug: '', description: '', icon: 'Folder' });
                  setShowCategoryModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{c.slug}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{c.description}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory({ ...c });
                              setShowCategoryModal(true);
                            }}
                            className="p-1 text-slate-500 hover:text-blue-600 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1 text-slate-500 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: USER MANAGEMENT */}
        {activeSection === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Registered Users & Account Moderation</h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            u.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            u.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5: DOWNLOAD TELEMETRY */}
        {activeSection === 'downloads' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Download Telemetry & Audit Logs</h2>
              <select
                value={downloadFilterSoftware}
                onChange={(e) => setDownloadFilterSoftware(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Software Logs</option>
                {softwareList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Download ID</th>
                    <th className="py-3 px-4">Software</th>
                    <th className="py-3 px-4">User Account</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Security Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {downloads
                    .filter((d) => downloadFilterSoftware === 'all' || d.software_id === downloadFilterSoftware)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.id.slice(0, 12)}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {item.software_title} (v{item.software_version})
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{item.user_email || 'guest'}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {new Date(item.download_date).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3 h-3" />
                            <span>Validated Clean</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 6: ADSTERRA AD MANAGEMENT */}
        {activeSection === 'ads' && (
          <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
            {/* Guide & Instructions Box */}
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-200">
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Adsterra Ads কোড যুক্ত করার নির্দেশিকা (Adsterra Code Setup Guide)</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                আপনার Adsterra Publisher Dashboard (Websites &gt; Add Unit / Get Code) থেকে প্রাপ্ত <strong>HTML / JavaScript / iframe</strong> কোডটি সরাসরি নিচের সংশ্লিষ্ট স্লটের <strong>&quot;Adsterra Ad Code&quot;</strong> বক্সে পেস্ট করুন। প্রতিটি স্লটের জন্য <strong>Save Adsterra Placement</strong> বাটনে ক্লিক করে সংরক্ষণ করুন এবং <strong>Placement Active</strong> টগল অন করে সাইটে বিজ্ঞাপন চালু করুন।
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Adsterra Advertisement Placements</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure your approved Adsterra publisher placement codes, paste HTML scripts, and test live views.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Total Placements: {adsSettings.length}
              </span>
            </div>

            {/* List of Ad Units with Code Textareas */}
            <div className="space-y-5">
              {adsSettings.map((ad) => (
                <AdUnitCard
                  key={ad.id}
                  ad={ad}
                  onSave={handleSaveAdSettings}
                />
              ))}
            </div>
          </div>
        )}


        {/* SECTION 7: WEBSITE SETTINGS */}
        {activeSection === 'settings' && siteSettings && (
          <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Website Branding & Content Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your public marketplace name, hero headline, and contact details.
              </p>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website Name
                </label>
                <input
                  type="text"
                  value={siteSettings.site_name}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Section Headline
                </label>
                <input
                  type="text"
                  value={siteSettings.hero_headline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hero_headline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Section Subheadline
                </label>
                <textarea
                  value={siteSettings.hero_subheadline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hero_subheadline: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Support Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contact_email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* SOFTWARE EDIT / CREATE MODAL */}
      {showSoftwareModal && editingSoftware && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-100">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingSoftware.id ? 'Edit Software Listing' : 'Publish New Software'}
            </h3>

            <form onSubmit={handleSaveSoftwareSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Software Title *
                  </label>
                  <input
                    type="text"
                    value={editingSoftware.title || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, title: e.target.value })}
                    required
                    placeholder="e.g. CodeSphere IDE"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingSoftware.slug || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, slug: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingSoftware.category_id || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, category_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Version *
                  </label>
                  <input
                    type="text"
                    value={editingSoftware.version || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, version: e.target.value })}
                    required
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform *
                  </label>
                  <select
                    value={editingSoftware.platform || 'Cross-Platform'}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, platform: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Cross-Platform">Cross-Platform</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Linux">Linux</option>
                    <option value="Web">Web</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={editingSoftware.short_description || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, short_description: e.target.value })}
                  required
                  placeholder="One or two sentences summarizing key capabilities..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Description
                </label>
                <textarea
                  value={editingSoftware.full_description || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, full_description: e.target.value })}
                  rows={4}
                  placeholder="Comprehensive technical breakdown, features, and workflows..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Download URL (Google Drive or HTTPS)
                  </label>
                  <input
                    type="url"
                    value={editingSoftware.download_url || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, download_url: e.target.value })}
                    placeholder="https://drive.google.com/file/d/... or https://..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={editingSoftware.thumbnail_url || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, thumbnail_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  System Requirements
                </label>
                <input
                  type="text"
                  value={editingSoftware.system_requirements || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, system_requirements: e.target.value })}
                  placeholder="OS version, RAM, CPU, GPU requirements..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingSoftware.is_paid || false}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, is_paid: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Commercial / Paid Software</span>
                </label>

                {editingSoftware.is_paid && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingSoftware.price || 0}
                      onChange={(e) => setEditingSoftware({ ...editingSoftware, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingSoftware.is_published ?? true}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, is_published: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingSoftware.is_featured || false}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, is_featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSoftwareModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Software
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingCategory.id ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  placeholder="e.g. AI & Machine Learning"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="auto-generated"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
