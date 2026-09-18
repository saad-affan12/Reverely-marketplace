import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';

interface ProtectedLayoutProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultRoute =
      user.role === 'customer'
        ? '/customer/dashboard'
        : user.role === 'vendor'
        ? '/vendor/dashboard'
        : '/admin/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedLayout;
