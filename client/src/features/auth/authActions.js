// src/features/auth/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });

      // Check backend response structure
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      return response.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);
