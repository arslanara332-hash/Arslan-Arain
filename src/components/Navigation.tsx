import { Home, Grid, Heart, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Navigation() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-all duration-300 px-4 py-2 border-2 border-transparent",
                isActive 
                  ? "text-slate-900 dark:text-white bg-blue-600 border-slate-900 dark:border-white anime-shadow animate-in zoom-in-75 duration-300 -translate-y-2 !rotate-3" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              )
            }
          >
            <item.icon className={cn("w-6 h-6", item.path === '/' && "scale-110")} />
            <span className="text-[10px] font-black uppercase tracking-tighter italic">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
