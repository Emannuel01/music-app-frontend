// src/components/SongItem.jsx
import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './SongItem.css';

function SongItem({ song, songList, onAddToPlaylistClick, onRemoveClick }) {
  const { playSong } = usePlayer();

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action(song);
  };

  const artworkUrl = song.album_art_filename 
    ? `${import.meta.env.VITE_BACKEND_URL}/files/${song.album_art_filename}`
    : null;

  return (
    <li className="song-item" onClick={() => playSong(song, songList)}>

      {/* Adicionamos a imagem da capa aqui */}
      {artworkUrl ? (
        <img src={artworkUrl} alt={song.music_name} className="song-item-artwork" />
      ) : (
        <div className="song-item-artwork-placeholder">🎵</div>
      )}

      <div className="song-info">
        <span className="song-name">{song.music_name}</span>
        <span className="song-artist">{song.author} ({song.year})</span>
      </div>

      <div className="song-actions">
        {onRemoveClick && (
          <button className="remove-from-playlist-btn" onClick={(e) => handleActionClick(e, onRemoveClick)}>×</button>
        )}
        <button className="play-button" onClick={(e) => handleActionClick(e, () => playSong(song, songList))}>▶</button>
      </div>
    </li>
  );
}

export default SongItem;