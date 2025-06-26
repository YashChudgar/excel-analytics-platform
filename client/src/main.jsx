// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FileProvider } from './context/FileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>    
  <Provider store={store}>
    <FileProvider>
      <App />
      </FileProvider>
    </Provider>
  </GoogleOAuthProvider>
);
