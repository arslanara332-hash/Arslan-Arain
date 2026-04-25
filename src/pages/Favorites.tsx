import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Search as SearchIcon } from 'lucide-react';
import { Wallpaper } from '../types';
import WallpaperCard from '../components/WallpaperCard';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('fav_wallpapers') || '[]');
    setFavorites(favs);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 transform -rotate-1">
        <Heart className="w-6 h-6 text-neon-pink fill-current" />
        <h2 className="text-3xl font-black italic tracking-tighter manga-title uppercase">My Vault</h2>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
             <p className="text-xl font-bold">Your favorites is empty</p>
             <p className="text-slate-500 text-sm">Save wallpapers you love to see them here.</p>
          </div>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Explore wallpapers</Link>
        </div>
      )}
    </motion.div>
  );
}
