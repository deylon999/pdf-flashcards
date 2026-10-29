import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import { ErrorMessage, Loader } from '@/shared/ui';

export function RequireAuth() {
  const { user, status, restoreSession } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Loader text="Проверяем сессию…" />;
  if (status === 'error') return <ErrorMessage text="Не удалось связаться с сервером" onRetry={restoreSession} />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return <Outlet />;
}
