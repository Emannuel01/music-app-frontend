// src/components/Layout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Player from './Player';
import Modal from './Modal';
import { usePlayer } from '../context/PlayerContext';

function Layout() {
  // Pega tudo que precisa do PlayerContext
  const { 
    isPlaylistModalOpen, 
    closeAddToPlaylistModal, 
    userPlaylists,
    handleAddSongToPlaylist, // Para adicionar a uma playlist existente
    handleCreateAndAdd,     // Nossa nova função para criar e adicionar
    currentSong
  } = usePlayer();

  // Estado local apenas para o campo de texto do formulário no modal
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Função para chamar a lógica do contexto
  const onFormSubmit = (e) => {
    e.preventDefault();
    handleCreateAndAdd(newPlaylistName);
    setNewPlaylistName(''); // Limpa o campo após o envio
  };

  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Player />
      
      <Modal isOpen={isPlaylistModalOpen} onClose={closeAddToPlaylistModal}>
        <h2>Adicionar à Playlist</h2>
        
        <form onSubmit={onFormSubmit} className="modal-create-playlist-form">
          <input 
            type="text" 
            placeholder="Nome da nova playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button type="submit">Criar e Adicionar</button>
        </form>

        <p>Ou selecione uma playlist existente:</p>
        <ul className="playlist-selection-list">
          {userPlaylists.length > 0 ? (
            userPlaylists.map(playlist => (
              <li 
                key={playlist.id} 
                className="playlist-selection-item"
                onClick={() => handleAddSongToPlaylist(playlist.id)}
              >
                <span>🎵</span> 
                <span>{playlist.name}</span>
              </li>
            ))
          ) : ( <p>Você não tem nenhuma playlist.</p> )}
        </ul>
      </Modal>
    </div>
  );
}

export default Layout;