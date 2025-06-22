// src/App.jsx

import { Routes, Route } from 'react-router-dom';

// Componentes e Páginas
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // 1. Importa o "porteiro"
import Notification from './components/Notification';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import PlaylistsPage from './pages/PlaylistsPage';
import UploadPage from './pages/UploadPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <>
      <Notification /> 
      
      <Routes>
        {/* Rotas Públicas: Login e Cadastro */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. Envolvemos nosso Layout com o ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* Todas as rotas aqui dentro agora estão protegidas! */}
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="playlists" element={<PlaylistsPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="playlist/:playlistId" element={<PlaylistDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;