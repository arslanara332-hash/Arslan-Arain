import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Grid, ChevronRight } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const categoryImages: Record<string, string> = {
    'Nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=60&w=500',
    'Cars': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=60&w=500',
    'Anime': 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=60&w=500',
    'Islamic': 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=60&w=500',
    'Abstract': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=500',
    'AMOLED': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=60&w=500',
    'Dark': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=60&w=500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Grid className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">Explore Styles</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          >
            <Link 
              to={`/categories/${cat}`}
              className="relative group h-40 rounded-[32px] overflow-hidden flex items-center p-8 border-2 border-slate-900 dark:border-white anime-shadow transition-all hover:-translate-y-2 hover:anime-shadow-blue"
            >
              <img 
                src={categoryImages[cat] || categoryImages['Abstract']} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                alt={cat}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent group-hover:from-black/60 transition-colors" />
              
              <div className="relative z-10 w-full flex justify-between items-center text-white">
                <span className="text-3xl font-black italic tracking-tighter manga-title uppercase group-hover:tracking-widest transition-all duration-300">{cat}</span>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform group-hover:rotate-90 transition-all duration-500">
                  <ChevronRight className="w-8 h-8" />
                </div>
              </div>

              <div className="absolute top-4 right-4 text-[8px] font-black text-white/50 tracking-[0.4em] uppercase">Channel 0{i+1}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
