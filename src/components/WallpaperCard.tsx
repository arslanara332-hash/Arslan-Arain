import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Eye, Crown } from 'lucide-react';
import { Wallpaper } from '../types';
import { cn } from '../lib/utils';

interface WallpaperCardProps {
  key?: string | number;
  wallpaper: Wallpaper;
  index: number;
}

export default function WallpaperCard({ wallpaper, index }: WallpaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, rotateZ: index % 2 === 0 ? 1 : -1 }}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-900 dark:border-white anime-shadow transition-transform duration-300"
    >
      <Link to={`/wallpaper/${wallpaper.id}`}>
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125"
        />
        
        <div className="absolute inset-x-2 bottom-2 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white p-2 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
          <div className="flex items-center justify-between text-slate-900 dark:text-white">
            <span className="text-[10px] font-black uppercase tracking-tighter truncate pr-2 italic">{wallpaper.title}</span>
            <div className="flex items-center gap-1 opacity-80 shrink-0">
              <Eye className="w-3 h-3" />
              <span className="text-[8px] font-bold">{wallpaper.views}</span>
            </div>
          </div>
        </div>

        {wallpaper.isPremium && (
          <div className="absolute top-2 right-2 bg-neon-yellow text-slate-900 p-1.5 rounded-lg border-2 border-slate-900 anime-shadow-pink scale-75 group-hover:scale-100 transition-transform">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
