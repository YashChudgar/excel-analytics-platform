// PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = !!token && !!user;


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
