// src/features/auth/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// ✅ Login Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      return response.data; // { user, token, success }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// ✅ Register Thunk (add this below loginUser)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Registration failed');
      }

      return response.data; // { user, token, success }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);
