import React, { useState, useEffect } from 'react';
import playlistService from '../services/playlistService';
import PlaylistItem from '../components/PlaylistItem';
import Modal from '../components/Modal';
import './PlaylistsPage.css';

function PlaylistsPage() {
  // Estado para os dados da página e carregamento
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o modal de Criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [formError, setFormError] = useState('');

  // Estados para o modal de Deleção
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  // --- LÓGICA DE DADOS ---

  // Função para buscar as playlists na API
  const fetchPlaylists = async () => {
    // Não precisa iniciar o loading aqui se já iniciou no estado inicial
    try {
      const data = await playlistService.getMyPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Erro ao buscar playlists", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca as playlists quando a página carrega pela primeira vez
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // --- LÓGICA PARA CRIAR PLAYLIST ---

  const openCreateModal = () => {
    setNewPlaylistName(''); // Limpa o nome anterior
    setFormError(''); // Limpa erros anteriores
    setIsCreateModalOpen(true);
  };
  
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    setFormError('');

    try {
      await playlistService.createPlaylist({ name: newPlaylistName });
      setIsCreateModalOpen(false); // Fecha o modal com sucesso
      fetchPlaylists(); // Atualiza a lista para mostrar a nova playlist
    } catch (error) {
      // Pega o erro 409 (conflito) do back-end, se o nome já existir
      if (error.response && error.response.status === 409) {
        setFormError(error.response.data.message);
      } else {
        setFormError("Não foi possível criar a playlist.");
      }
      console.error("Erro ao criar playlist", error);
    }
  };
  
  // --- LÓGICA PARA DELETAR PLAYLIST ---

  const openDeleteModal = (playlist) => {
    setPlaylistToDelete(playlist); // Guarda a playlist que queremos deletar
    setIsDeleteModalOpen(true); // Abre o modal de confirmação
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPlaylistToDelete(null); // Limpa o estado
  };

  const handleConfirmDelete = async () => {
    if (!playlistToDelete) return;
    try {
      await playlistService.deletePlaylist(playlistToDelete.id);
      closeDeleteModal(); // Fecha o modal
      fetchPlaylists(); // Atualiza a lista para remover a playlist deletada
    } catch (error) {
      console.error("Erro ao deletar playlist", error);
      alert("Não foi possível deletar a playlist.");
    }
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---

  return (
    <div className="playlists-page">
      <div className="page-header">
        <h1>Minhas Playlists</h1>
        <button className="create-playlist-button" onClick={openCreateModal}>
          +
        </button>
      </div>
      
      <div className="playlists-grid">
        {loading ? (
          <p style={{ color: "white" }}>Carregando...</p>
        ) : (
          playlists.map(playlist => (
            <PlaylistItem 
              key={playlist.id} 
              playlist={playlist}
              onDeleteClick={openDeleteModal} // Passa a função para o card
            />
          ))
        )}
      </div>

      {/* Modal de Criação */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2>Criar Nova Playlist</h2>
        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Nome da sua nova playlist..."
            autoFocus
          />
          {formError && <p className="form-error">{formError}</p>}
          <button type="submit">Criar</button>
        </form>
      </Modal>

      {/* Modal de Confirmação de Deleção */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h2>Confirmar Exclusão</h2>
        {playlistToDelete && (
          <p>
            Tem certeza que deseja deletar a playlist permanentemente?
            <br />
            <strong>"{playlistToDelete.name}"</strong>
          </p>
        )}
        <div className="confirmation-buttons">
          <button onClick={closeDeleteModal} className="button-secondary">Cancelar</button>
          <button onClick={handleConfirmDelete} className="button-danger">Deletar</button>
        </div>
      </Modal>
    </div>
  );
}

export default PlaylistsPage;