import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-brand-600 dark:text-brand-500 font-mono tracking-tight">
        SmartLeads
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
          {isDark ? '☀️' : '🌙'}
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {user?.name} <span className="ml-1 text-xs bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-mono">{user?.role}</span>
        </span>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium">
          Logout
        </button>
      </div>
    </nav>
  );
}
