import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallpaper } from '../types';
import WallpaperCard from '../components/WallpaperCard';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(data => {
        setWallpapers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load wallpapers');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse">Fetching the best shots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 gap-2">
        <AlertCircle className="w-12 h-12" />
        <p>{error}</p>
      </div>
    );
  }

  const trending = wallpapers.slice(0, 5);
  const latest = wallpapers;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 animate-in fade-in duration-500 pb-12"
    >
      {/* Featured/Trending Section */}
      <section>
        <div className="flex items-center gap-2 mb-6 transform -rotate-2">
          <TrendingUp className="w-6 h-6 text-neon-pink" />
          <h2 className="text-2xl font-black italic tracking-tighter manga-title uppercase">Hot Drops</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 snap-x">
          {trending.map((w, i) => (
            <motion.div
              key={w.id}
              whileTap={{ scale: 0.95 }}
              className="min-w-[300px] h-[180px] rounded-3xl overflow-hidden relative border-2 border-slate-900 dark:border-white anime-shadow-pink snap-center group"
            >
              <img src={w.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={w.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xl font-black italic tracking-tight manga-title uppercase">{w.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad Placeholder (Banner) */}
      <section className="bg-neon-yellow/10 rounded-[32px] p-8 border-4 border-slate-900 dark:border-white anime-shadow flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-neon-pink rounded-full blur-2xl opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-neon-blue rounded-full blur-2xl opacity-50" />
        <div className="text-center space-y-2 relative z-10">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">PROMOTION ZONE</p>
          <p className="text-slate-900 dark:text-white font-black text-lg italic manga-title uppercase">Google AdMob Sponsored Content</p>
        </div>
      </section>

      {/* Latest Wallpapers Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 transform rotate-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-blue" />
            <h2 className="text-2xl font-black italic tracking-tighter manga-title uppercase">Fresh Picks</h2>
          </div>
          <span className="text-xs font-black text-white bg-slate-900 px-4 py-1.5 rounded-full anime-shadow-blue italic">{wallpapers.length} FILES</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {latest.map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[40px] p-8 flex flex-col md:flex-row gap-6 items-center anime-shadow-pink relative z-10">
         <div className="w-20 h-20 bg-neon-pink rounded-[28px] flex items-center justify-center text-white font-black text-2xl anime-shadow rotate-3">MAX</div>
         <div className="flex-1 text-center md:text-left">
           <p className="text-2xl font-black italic tracking-tight manga-title uppercase">Go Unlimited Pro</p>
           <p className="text-sm opacity-80 font-medium">Kill all ads and rip the 4K vault open today.</p>
         </div>
         <button className="bg-neon-yellow text-slate-900 font-black italic tracking-tighter px-8 py-4 rounded-2xl anime-shadow hover:scale-105 transition-transform uppercase">Upgrade Now</button>
      </section>
    </motion.div>
  );
}
