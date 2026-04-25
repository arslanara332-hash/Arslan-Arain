import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { Wallpaper } from '../types';
import WallpaperCard from '../components/WallpaperCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [filtered, setFiltered] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(data => {
        setAllWallpapers(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const lower = query.toLowerCase();
      setFiltered(
        allWallpapers.filter(w => 
          w.title.toLowerCase().includes(lower) || 
          w.category.toLowerCase().includes(lower)
        )
      );
    }
  }, [query, allWallpapers]);

  const suggestions = ['Nature', 'Car', 'Neon', 'Anime', '4K', 'Dark'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="sticky top-[72px] z-30 pt-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md pb-2">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search wallpapers, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl outline-none focus:border-blue-600 transition-all font-medium"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!query && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-4 -mx-4 px-4">
            {suggestions.map(tag => (
              <button 
                key={tag}
                onClick={() => setQuery(tag)}
                className="whitespace-nowrap px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {query ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-500">
            {filtered.length > 0 ? `Found ${filtered.length} wallpapers` : 'No results found'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((w, i) => (
              <WallpaperCard key={w.id} wallpaper={w} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 animate-in fade-in slide-in-from-bottom-8">
           <div className="inline-flex p-8 bg-blue-600/10 rounded-full border-4 border-slate-900 dark:border-white anime-shadow mb-6">
             <SearchIcon className="w-16 h-16 text-blue-600" />
           </div>
           <h3 className="text-3xl font-black italic tracking-tighter manga-title uppercase mb-4">Hunt for Styles</h3>
           <p className="text-slate-500 max-w-sm mx-auto font-medium">Punch in tags like <span className="text-neon-pink">'Neon'</span> or <span className="text-neon-blue">'Anime'</span> to track down your next setup.</p>
        </div>
      )}
    </motion.div>
  );
}
