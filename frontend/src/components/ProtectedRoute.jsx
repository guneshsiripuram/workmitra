import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#090d16', color: '#f3f4f6' }}>
        <p>Loading session details...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to homepage if user has a different role than allowed
  if (allowedRole && user.role !== allowedRole) {
    const defaultRoute = user.role === 'CUSTOMER' ? '/customer-dashboard' : '/worker-dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
