import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, Download, Image as ImageIcon, Share2, Crown, Sparkles, X } from 'lucide-react';
import { Wallpaper } from '../types';
import { cn } from '../lib/utils';

export default function WallpaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(data => {
        const found = data.find((w: Wallpaper) => w.id === id);
        if (found) {
          setWallpaper(found);
          // Track view
          fetch(`/api/wallpapers/track/${id}/view`, { method: 'POST' });
          
          // Check favorites
          const favorites = JSON.parse(localStorage.getItem('fav_wallpapers') || '[]');
          setIsFavorite(favorites.some((f: Wallpaper) => f.id === id));
        }
      });
  }, [id]);

  const toggleFavorite = () => {
    if (!wallpaper) return;
    const favorites = JSON.parse(localStorage.getItem('fav_wallpapers') || '[]');
    let newFavs;
    if (isFavorite) {
      newFavs = favorites.filter((f: Wallpaper) => f.id !== id);
    } else {
      newFavs = [...favorites, wallpaper];
    }
    localStorage.setItem('fav_wallpapers', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const handleDownload = async () => {
    if (!wallpaper) return;
    
    if (wallpaper.isPremium) {
      setShowRewardedAd(true);
      return;
    }

    startDownload();
  };

  const startDownload = async () => {
    if (!wallpaper) return;
    setIsDownloading(true);
    
    // Track download
    fetch(`/api/wallpapers/track/${id}/download`, { method: 'POST' });

    // Mock download delay
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
      setShowRewardedAd(false);
    }, 2000);
  };

  if (!wallpaper) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col"
    >
      {/* Dynamic Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={toggleFavorite}
            className={cn(
              "p-2 backdrop-blur-md rounded-full transition-colors",
              isFavorite ? "bg-red-500 text-white" : "bg-white/20 text-white"
            )}
          >
            <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Preview */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 group">
        <img 
          src={wallpaper.imageUrl} 
          className="w-full h-full object-cover" 
          alt={wallpaper.title} 
        />
        
        {/* AdMob Native Ad Overlay (Mock) */}
        <div className="absolute bottom-32 left-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hidden group-hover:block transition-all animate-in fade-in slide-in-from-bottom-4">
           <p className="text-[8px] text-white/60 mb-1">RECOMMENDED AD</p>
           <div className="flex gap-3">
             <div className="w-12 h-12 bg-blue-600 rounded-lg" />
             <div className="flex-1">
               <p className="text-xs font-bold text-white">Unlock Pro Features</p>
               <p className="text-[10px] text-white/80">Get fast downloads and no ads.</p>
             </div>
             <button className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-bold self-center">GET</button>
           </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-8 space-y-6 bg-white dark:bg-slate-900 rounded-t-[48px] -mt-12 border-t-4 border-slate-900 dark:border-white shadow-[0_-20px_50px_rgba(0,0,0,0.2)] relative z-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter manga-title uppercase">{wallpaper.title}</h2>
            <p className="text-slate-500 text-xs font-black tracking-widest uppercase mt-1">{wallpaper.category} SERIES • 4K RENDER</p>
          </div>
          {wallpaper.isPremium && (
            <div className="bg-neon-yellow text-slate-900 px-4 py-2 rounded-2xl border-2 border-slate-900 anime-shadow-pink flex items-center gap-1.5 -rotate-2">
              <Crown className="w-5 h-5 fill-current" />
              <span className="text-xs font-black italic">ELITE</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-5 rounded-3xl transition-all border-2 border-slate-900 anime-shadow active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tighter manga-title italic"
          >
            {isDownloading ? (
               <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-6 h-6" />
                <span>Download</span>
              </>
            )}
          </button>
          <button 
            onClick={() => alert("Setting wallpaper is handled by Android Intent in native apps. Download the image and set it via your device settings.")}
            className="flex items-center justify-center gap-2 bg-neon-pink hover:bg-pink-600 text-white font-black py-5 rounded-3xl transition-all border-2 border-slate-900 anime-shadow-blue active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tighter manga-title italic"
          >
            <ImageIcon className="w-6 h-6" />
            <span>Apply Now</span>
          </button>
        </div>
      </div>

      {/* Rewarded Ad Modal (Mock) */}
      <AnimatePresence>
        {showRewardedAd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
             <button 
               onClick={() => setShowRewardedAd(false)}
               className="absolute top-6 right-6 text-white/60 hover:text-white"
             >
               <X className="w-8 h-8" />
             </button>

             <div className="mb-8 p-6 bg-yellow-500 rounded-full animate-bounce">
               <Crown className="w-12 h-12 text-white fill-current" />
             </div>

             <h3 className="text-3xl font-black text-white mb-4 italic tracking-tighter">PREMIUM CONTENT</h3>
             <p className="text-slate-400 mb-8 max-w-sm">
               This is a premium wallpaper. Watch a short video to unlock it for free, or upgrade to Pro to remove all ads.
             </p>

             <div className="space-y-4 w-full max-w-sm">
               <button 
                 onClick={startDownload}
                 disabled={isDownloading}
                 className="w-full bg-white text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
               >
                 {isDownloading ? (
                   <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <>
                     <Sparkles className="w-6 h-6" />
                     <span>WATCH AD TO UNLOCK</span>
                   </>
                 )}
               </button>
               <button className="w-full border-2 border-white/20 text-white font-bold py-4 rounded-3xl hover:bg-white/10 transition-colors">
                 REMOVE ADS ($2.99)
               </button>
             </div>

             <div className="mt-12 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
               Google AdMob Rewarded Video Ad Area
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
