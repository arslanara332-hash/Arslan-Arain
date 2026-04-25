import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wallpaper } from '../types';
import WallpaperCard from '../components/WallpaperCard';
import { ChevronLeft } from 'lucide-react';

export default function CategoryDetail() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((w: Wallpaper) => w.category === category);
        setWallpapers(filtered);
        setLoading(false);
      });
  }, [category]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">{category}</h2>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wallpapers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wallpapers.map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p>No wallpapers found in this category yet.</p>
        </div>
      )}
    </motion.div>
  );
}
