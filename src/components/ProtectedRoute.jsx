import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const roleRoutes = {
      Admin: '/admin-dashboard',
      Manager: '/manager-dashboard',
      User: '/user-dashboard'
    };
    return <Navigate to={roleRoutes[userRole] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;