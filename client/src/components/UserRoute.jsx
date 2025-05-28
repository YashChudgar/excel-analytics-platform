import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = () => {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default UserRoute;
