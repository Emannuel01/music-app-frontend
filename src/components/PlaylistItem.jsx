import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistItem.css';

function PlaylistItem({ playlist, onDeleteClick }) {
  

   const coverArtUrl = playlist.audios?.[0]?.album_art_filename
    ? `${import.meta.env.VITE_BACKEND_URL}/files/${playlist.audios?.[0]?.album_art_filename}` 
    : null;

  
  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onDeleteClick(playlist);
  };

  return (
    <Link to={`/playlist/${playlist.id}`} className="playlist-card-link">
      <div className="playlist-card">
        
        {!playlist.isVirtual && onDeleteClick && (
          <button className="delete-playlist-btn" onClick={handleDelete}>×</button>
        )}
        
        <div className="playlist-artwork">
          {coverArtUrl ? (
            <img src={coverArtUrl} alt={playlist.name} className="playlist-artwork-img" />
          ) : (
            <span>{playlist.icon ? playlist.icon : '🎵'}</span>
          )}
        </div>
        <div className="playlist-info">
          <span className="playlist-name">{playlist.name}</span>
          <span className="playlist-description">{playlist.description || `${playlist.audios?.length || 0} músicas`}</span>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistItem;