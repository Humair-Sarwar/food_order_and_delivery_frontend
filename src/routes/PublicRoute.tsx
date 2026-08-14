// src/components/routes/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute: React.FC = () => {
  const token = localStorage.getItem("token"); 

  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};