import { Moon, Sun, Search, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-950 border-b-2 border-slate-900 dark:border-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center anime-shadow transform group-hover:-rotate-6 transition-transform">
            <span className="text-white font-black text-2xl italic manga-title">W</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter hidden sm:block manga-title italic px-2">
            WALLIFY<span className="text-blue-600">PRO</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>

          <Link
            to="/admin/login"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
