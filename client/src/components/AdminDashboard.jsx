import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
const AdminDashboard = () => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
      };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, admin! You can manage your app here.</p>
      {/* Add your admin-specific features here */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
