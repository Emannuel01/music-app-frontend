import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoriteContext';
import LyricsModal from './LyricsModal';
import MicrophoneIcon from './icons/MicrophoneIcon';
import './Player.css';

function Player() {
  const { 
    currentSong, isPlaying, togglePlayPause, 
    progress, duration, handleSeek, formatTime,
    playNext, playPrevious, volume, handleVolumeChange,
    openAddToPlaylistModal
  } = usePlayer();
  
  const { favoriteIds, toggleFavorite } = useFavorites();
  
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);

  if (!currentSong) {
    return null;
  }

  const isFavorited = favoriteIds.has(currentSong.id);

  const progressPercentage = duration ? (progress / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  const progressStyle = {
    background: `linear-gradient(to right, #1db954 ${progressPercentage}%, #4d4d4d ${progressPercentage}%)`
  };
  const volumeStyle = {
    background: `linear-gradient(to right, #1db954 ${volumePercentage}%, #4d4d4d ${volumePercentage}%)`
  };

  const artworkUrl = currentSong.album_art_filename;

  return (
    <>
      <div className="player-bar">
        <div className="player-song-info">
          {artworkUrl ? (
            <img src={artworkUrl} alt={currentSong.music_name} className="player-artwork" />
          ) : (
            <div className="player-artwork-placeholder"><span>🎵</span></div>
          )}
          <div className="song-text">
            <span className="player-song-name">{currentSong.music_name}</span>
            <span className="player-song-artist">{currentSong.author}</span>
          </div>
        </div>

        <div className="player-center-controls">
          <div className="main-controls">
            <button onClick={playPrevious} className="control-button secondary">«</button>
            <button onClick={togglePlayPause} className="control-button play-pause">
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button onClick={playNext} className="control-button secondary">»</button>
          </div>
          <div className="progress-bar-container">
            <span className="time-display">{formatTime(progress)}</span>
            <input 
              type="range" className="progress-bar"
              min="0" max={duration || 0} value={progress} onChange={handleSeek}
              style={progressStyle}
            />
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right-controls">
          {currentSong.lyrics && (
            <button className="control-button secondary" onClick={() => setIsLyricsModalOpen(true)}>
              <MicrophoneIcon />
            </button>
          )}
          <button className="control-button secondary" onClick={openAddToPlaylistModal}>+</button>
          <button 
            className={`control-button secondary ${isFavorited ? 'active' : ''}`} 
            onClick={() => toggleFavorite(currentSong)}
          >
            ♥
          </button>
          <span>🔊</span>
          <input 
            type="range" className="volume-slider" 
            min="0" max="1" step="0.01" value={volume}
            onChange={handleVolumeChange}
            style={volumeStyle}
          />
        </div>
      </div>

      <LyricsModal 
        isOpen={isLyricsModalOpen}
        onClose={() => setIsLyricsModalOpen(false)}
        songName={currentSong.music_name}
        lyrics={currentSong.lyrics}
      />
    </>
  );
}

export default Player;