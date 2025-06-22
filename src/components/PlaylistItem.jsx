import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistItem.css';

function PlaylistItem({ playlist, onDeleteClick }) {
  
  // Lógica da Capa Dinâmica:
  // Pega o nome do arquivo da capa da primeira música na playlist, se existir
  const coverArtFilename = playlist.audios?.[0]?.album_art_filename;
  
  const artworkUrl = coverArtFilename 
    ?  `${import.meta.env.VITE_BACKEND_URL}/files/${coverArtFilename}` 
    : null;
  
  // Função para lidar com o clique no botão de deletar
  const handleDelete = (event) => {
    // Impede que o clique no botão ative o Link que navega para outra página
    event.preventDefault();
    event.stopPropagation();
    
    onDeleteClick(playlist); // Chama a função que foi passada pelo componente pai
  };

  return (
    <Link to={`/playlist/${playlist.id}`} className="playlist-card-link">
      <div className="playlist-card">
        
        {/* Renderiza o botão de deletar condicionalmente */}
        {!playlist.isVirtual && onDeleteClick && (
          <button className="delete-playlist-btn" onClick={handleDelete}>×</button>
        )}
        
        <div className="playlist-artwork">
          {/* Renderiza a imagem da capa se ela existir, senão, mostra o ícone padrão */}
          {artworkUrl ? (
            <img src={artworkUrl} alt={playlist.name} className="playlist-artwork-img" />
          ) : (
            <span>{playlist.icon ? playlist.icon : '🎵'}</span>
          )}
        </div>
        <div className="playlist-info">
          <span className="playlist-name">{playlist.name}</span>
          <span className="playlist-description">{playlist.description}</span>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistItem;