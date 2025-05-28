// src/features/auth/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error || 'Login failed');
    }
  }
);

// Fetch profile thunk (protected)
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error || 'Fetching profile failed');
    }
  }
);
