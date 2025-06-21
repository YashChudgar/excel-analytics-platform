// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, updateUser } from './authActions';

//  Utility: Check if token is a valid JWT & not expired
const isTokenValid = (token) => {
  try {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT structure:', token);
      return false;
    }


    const payload = JSON.parse(atob(parts[1]));
    const expiry = payload.exp * 1000;
    const now = Date.now();

    console.log("Token expiry:", new Date(expiry), "Now:", new Date(now));
    return expiry > now;
  } catch (error) {
    console.error('Token validation error:', error.message);
    return false;
  }
};

//  1. Get raw token
const localToken = localStorage.getItem('token');

//  2. Check if it's valid
const validToken = localToken && isTokenValid(localToken) ? localToken : null;

// 3. Parse user only if token is valid
const localUser = localStorage.getItem('user');
const parsedUser = validToken && localUser ? JSON.parse(localUser) : null;

//  4. Clear invalid data
if (!validToken) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

//  5. Define initial state
const initialState = {
  user: parsedUser,
  token: validToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); //  clear stored user too
    },
    updateUserLocally: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
      localStorage.setItem('user', JSON.stringify(state.user)); //  update localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user)); //  Save user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user)); //  Save user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      //update cases
      .addCase(updateUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload; // assumes response returns updated user
  localStorage.setItem('user', JSON.stringify(action.payload));
})
.addCase(updateUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || 'Update failed';
})
  },
});

export const { logout, updateUserLocally } = authSlice.actions;
export { loginUser, registerUser };
export default authSlice.reducer;