import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import playlistService from '../services/playlistService';
import favoriteService from '../services/favoriteService';
import SongItem from '../components/SongItem';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';
import historyService from '../services/historyService';
import './PlaylistDetailPage.css';

function PlaylistDetailPage() {
  // --- HOOKS ---
  const { playlistId } = useParams(); // Pega o ID da URL (ex: '12' ou 'favorites')
  const { showNotification } = useNotification(); // Pega a função de notificação

  // --- ESTADOS DA PÁGINA ---
  const [playlistInfo, setPlaylistInfo] = useState(null); // Guarda info da playlist (nome, desc)
  const [songs, setSongs] = useState([]); // Guarda a lista de músicas
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DOS MODAIS ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState(false);
  const [songToRemove, setSongToRemove] = useState(null);

  // --- LÓGICA DE BUSCA DE DADOS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (playlistId === 'favorites') {
        // Lógica para a playlist virtual de "Músicas Curtidas"
        const favoriteSongs = await favoriteService.getMyFavorites();
        setSongs(favoriteSongs);
        setPlaylistInfo({ name: 'Músicas Curtidas', description: `${favoriteSongs.length} músicas` });
      } else if (playlistId === 'recent') { // --- NOVA CONDIÇÃO ---
        const recentSongs = await historyService.getRecentPlays();
        setSongs(recentSongs);
        setPlaylistInfo({ name: 'Ouvidas Recentemente', description: `${recentSongs.length} músicas` });
      }else {
        // Lógica para playlists normais
        const playlistData = await playlistService.getPlaylistById(playlistId);
        setPlaylistInfo(playlistData);
        setSongs(playlistData.audios || []);
      }
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
      showNotification("Não foi possível carregar o conteúdo.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Roda a busca de dados sempre que o ID da playlist na URL mudar
  useEffect(() => {
    fetchData();
  }, [playlistId]);


  // --- LÓGICA DE EDIÇÃO DA PLAYLIST ---
  const openEditModal = () => {
    setEditFormData({
      name: playlistInfo.name,
      description: playlistInfo.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await playlistService.updatePlaylist(playlistId, editFormData);
      showNotification("Playlist atualizada com sucesso!");
      setIsEditModalOpen(false);
      fetchData(); // Recarrega os dados para mostrar as alterações
    } catch (error) {
      showNotification("Não foi possível atualizar a playlist.", error);
    }
  };

  // --- LÓGICA DE REMOÇÃO DE MÚSICA ---
  const openRemoveSongModal = (song) => {
    setSongToRemove(song);
    setIsConfirmRemoveModalOpen(true);
  };

  const closeRemoveSongModal = () => {
    setIsConfirmRemoveModalOpen(false);
    setSongToRemove(null);
  };

  const handleConfirmRemoveSong = async () => {
    if (!songToRemove) return;
    try {
      await playlistService.removeSongFromPlaylist({ playlistId, audioId: songToRemove.id });
      setSongs(currentSongs => currentSongs.filter(song => song.id !== songToRemove.id));
      showNotification(`"${songToRemove.music_name}" removida da playlist.`);
    } catch (err) {
      showNotification("Não foi possível remover a música.", err);
    } finally {
      closeRemoveSongModal();
    }
  };


  // --- RENDERIZAÇÃO ---
  if (loading) return <p className="status-message">Carregando...</p>;
  if (!playlistInfo) return <p className="status-message">Playlist não encontrada.</p>;

  return (
    <>
      <div className="playlist-detail-container">
        <div className="playlist-header">
          <div className="playlist-artwork-large">
            {playlistId === 'favorites' ? '♥' : '🎵'}
          </div>
          <div className="playlist-meta">
            <span className="playlist-type">PLAYLIST</span>
            <h1>{playlistInfo.name}</h1>
            <p>{playlistInfo.description}</p>
            {/* O botão de editar só aparece para playlists reais */}
            {playlistId !== 'favorites' && (
              <button onClick={openEditModal} className="edit-playlist-btn">Editar Detalhes</button>
            )}
          </div>
        </div>

        <div className="song-list">
          <ul>
            {songs.length > 0 ? (
              songs.map(song => (
                <SongItem 
                  key={song.id} 
                  song={song} 
                  songList={songs}
                  // A opção de remover só aparece para playlists reais
                  onRemoveClick={playlistId !== 'favorites' ? openRemoveSongModal : null}
                />
              ))
            ) : (
              <p className="status-message">Nenhuma música aqui ainda.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Modal para Editar a Playlist */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Editar Detalhes da Playlist</h2>
        <form onSubmit={handleUpdatePlaylist} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input 
              type="text" id="name" name="name"
              value={editFormData.name} onChange={handleEditFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description" name="description" rows="4"
              value={editFormData.description} onChange={handleEditFormChange}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
            <button type="submit" className="button-primary">Salvar</button>
          </div>
        </form>
      </Modal>

      {/* Modal para Confirmar Remoção de Música */}
      <Modal isOpen={isConfirmRemoveModalOpen} onClose={closeRemoveSongModal}>
        <h2>Remover Música</h2>
        {songToRemove && (
          <p>
            Tem certeza que deseja remover a música 
            <br />
            <strong>"{songToRemove.music_name}"</strong> desta playlist?
          </p>
        )}
        <div className="confirmation-buttons">
          <button onClick={closeRemoveSongModal} className="button-secondary">Cancelar</button>
          <button onClick={handleConfirmRemoveSong} className="button-danger">Remover</button>
        </div>
      </Modal>
    </>
  );
}

export default PlaylistDetailPage;