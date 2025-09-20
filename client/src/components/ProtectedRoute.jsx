import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}
