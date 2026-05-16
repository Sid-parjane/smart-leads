import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { user, token } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
