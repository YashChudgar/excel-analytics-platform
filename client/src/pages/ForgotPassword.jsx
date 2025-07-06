import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom"; 


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/check-user", { email });
      setUserFound(true);
      setMessage(res.data.message);
    } catch (err) {
      setUserFound(false);
      setMessage(err.response?.data?.message || "User not found");
    }
  };

const handleResetSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match");
    return;
  }
  setIsLoading(true);
  try {
    const res = await axiosInstance.post("/auth/reset-password-direct", {
      email,
      password: newPassword,
    });

    setMessage(res.data.message);

    // ✅ No await inside setTimeout
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1000);

  } catch (err) {
    setIsLoading(false)
    setMessage(err.response?.data?.message || "Error updating password");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Forgot Password
        </h2>

        {/* Step 1: Email Check Form */}
        {!userFound && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your registered email
              </label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  ) : (
              "Verify Email"
            )}
</button>
          </form>
        )}

        {/* Step 2: Show Reset Form */}
        {userFound && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="relative">
  <label className="block text-sm font-medium text-gray-700">
    New Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    required
    className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

<div className="relative">
  <label className="block text-sm font-medium text-gray-700">
    Confirm Password
  </label>
  <input
    type={showConfirmPassword ? "text" : "password"}
    required
    className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>

           <button
  type="submit"
  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
  disabled={isLoading}
>
  {isLoading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  ) : (
    "Update Password"
  )}
</button>

          </form>
        )}

        {/* Status message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
