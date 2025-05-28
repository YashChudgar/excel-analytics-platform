import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Redirect to dashboard or admin dashboard based on role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate('/admin');  // Admin dashboard route
      } else {
        navigate('/dashboard');  // Regular user dashboard route
      }
    }
  }, [user, navigate]);

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        required
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
        required
        className="border p-2 mb-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 w-full"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default Login;
