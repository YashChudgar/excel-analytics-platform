// AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== "admin") return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default AdminRoute;
