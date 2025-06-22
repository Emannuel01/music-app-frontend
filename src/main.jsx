// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx'; // 1. Importa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider> {/* 2. Adiciona o provedor aqui */}
          <FavoriteProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </FavoriteProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);