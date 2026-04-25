import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plus, Trash2, LayoutDashboard, Image as ImageIcon, 
  BarChart3, Upload, Check, X, LogOut, Crown, Eye, Download 
} from 'lucide-react';
import { Wallpaper, Stats } from '../../types';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({ downloads: 0, views: 0 });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wallRes, catRes, statsRes] = await Promise.all([
        fetch('/api/wallpapers'),
        fetch('/api/categories'),
        fetch('/api/stats')
      ]);
      setWallpapers(await wallRes.json());
      setCategories(await catRes.json());
      setStats(await statsRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !category) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('isPremium', String(isPremium));

    try {
      const res = await fetch('/api/wallpapers', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccessMsg('Wallpaper uploaded successfully!');
        setTitle('');
        setCategory('');
        setIsPremium(false);
        setImageFile(null);
        fetchData();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallpaper?')) return;
    
    await fetch(`/api/wallpapers/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) return <div className="p-20 text-center">Authentication...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">ADMIN CONSOLE</h1>
            <p className="text-slate-500 font-medium">Control center for Wallify Pro HD</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button 
             onClick={handleLogout}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 font-bold rounded-2xl border border-red-100 dark:border-red-900/20"
           >
             <LogOut className="w-5 h-5" />
             <span>Exit</span>
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: ImageIcon, label: 'TOTAL ASSETS', value: wallpapers.length, color: 'bg-blue-600', shadow: 'anime-shadow-blue' },
          { icon: Download, label: 'TOTAL DLs', value: stats.downloads, color: 'bg-neon-pink', shadow: 'anime-shadow-pink' },
          { icon: Eye, label: 'TOTAL VIEWS', value: stats.views, color: 'bg-purple-600', shadow: 'anime-shadow' },
          { icon: BarChart3, label: 'AVG DAILY', value: Math.round(stats.downloads / 30), color: 'bg-neon-yellow text-slate-900', shadow: 'anime-shadow' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("p-6 bg-white dark:bg-slate-950 rounded-[32px] border-2 border-slate-900 dark:border-white transition-all hover:-translate-y-1", stat.shadow)}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 border-2 border-slate-900 dark:border-white anime-shadow", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 mb-1 uppercase">{stat.label}</p>
            <p className="text-2xl font-black italic manga-title tracking-tight">{stat.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <section className="lg:col-span-1 space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Plus className="w-5 h-5 text-blue-600" />
               New Entry
            </h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-600"
                  placeholder="e.g. Neon Sunset"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-600 appearance-none"
                  required
                >
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                   <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", isPremium ? "bg-yellow-500" : "bg-slate-300 dark:bg-slate-700")}>
                     <Crown className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-sm font-bold leading-none">Premium Pass</p>
                     <p className="text-[10px] text-slate-500">Requires ad or subscription</p>
                   </div>
                </div>
                <input 
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-6 h-6 rounded-lg accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Image Asset</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <div className="flex flex-col items-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">
                      {imageFile ? imageFile.name : 'Select JPG/PNG'}
                    </p>
                  </div>
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-2xl text-xs border border-green-100 dark:border-green-900/20">
                  <Check className="w-4 h-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Wallify</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Manage Section */}
        <section className="lg:col-span-2">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-blue-600" />
                 Managed Artifacts
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full">
                {wallpapers.length} Wallpapers
              </span>
            </div>

            <div className="space-y-4">
              {wallpapers.map((w) => (
                <div 
                  key={w.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 group"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                    <img src={w.imageUrl} className="w-full h-full object-cover" alt={w.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold flex items-center gap-1.5">
                      {w.title}
                      {w.isPremium && <Crown className="w-3 h-3 text-yellow-500 fill-current" />}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{w.category} • {w.views} Views</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(w.id)}
                      className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {wallpapers.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                   <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                   <p>No wallpapers curated yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
