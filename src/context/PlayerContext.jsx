import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import playlistService from '../services/playlistService';
import { useNotification } from './NotificationContext.jsx';

const PlayerContext = createContext(null);

// Lógica para carregar o volume salvo do localStorage
const VOLUME_STORAGE_KEY = 'musicapp-volume';
const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 1;

export const PlayerProvider = ({ children }) => {
  const { showNotification } = useNotification();

  // Estados do Player
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  
  // Estados da Fila de Reprodução (Queue)
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // Estados do Modal "Adicionar à Playlist"
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  const audioRef = useRef(null);

  // Efeitos
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Erro ao iniciar o play:", error);
        showNotification("Erro ao carregar o áudio. O arquivo pode ser inválido ou não foi encontrado.", 'error');
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Funções de Controle do Player
  const playSong = (song, songList = []) => {
    const songUrl = song.filename;
    
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setCurrentSong({ ...song, url: songUrl });
      setQueue(songList);
      const newIndex = songList.findIndex(item => item.id === song.id);
      setCurrentQueueIndex(newIndex);
    }
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const playNext = useCallback(() => {
    if (queue.length === 0 || currentQueueIndex >= queue.length - 1) return;
    const nextIndex = currentQueueIndex + 1;
    playSong(queue[nextIndex], queue);
  }, [queue, currentQueueIndex]);

  const playPrevious = () => {
    if (queue.length === 0 || currentQueueIndex <= 0) {
      if(audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentQueueIndex - 1;
    playSong(queue[prevIndex], queue);
  };
  
  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // Funções do Modal de Playlist
  const openAddToPlaylistModal = async () => {
    if (!currentSong) {
      showNotification("Nenhuma música tocando para adicionar.", "error");
      return;
    }
    try {
      const playlists = await playlistService.getMyPlaylists();
      setUserPlaylists(playlists);
      setIsPlaylistModalOpen(true);
    } catch (error) {
      showNotification("Não foi possível carregar suas playlists.", "error");
    }
  };

  const closeAddToPlaylistModal = () => setIsPlaylistModalOpen(false);

  const handleAddSongToPlaylist = async (playlistId) => {
    if (!currentSong) return;
    try {
      await playlistService.addSongToPlaylist({ playlistId, audioId: currentSong.id });
      showNotification(`Música "${currentSong.music_name}" adicionada com sucesso!`);
      closeAddToPlaylistModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Não foi possível adicionar a música.";
      showNotification(errorMessage, 'error');
    }
  };
  
  const handleCreateAndAdd = async (newPlaylistName) => {
    if (!newPlaylistName.trim() || !currentSong) return;
    try {
      const createResponse = await playlistService.createPlaylist({ name: newPlaylistName });
      const newPlaylistId = createResponse.playlistId;
      await playlistService.addSongToPlaylist({ playlistId: newPlaylistId, audioId: currentSong.id });
      showNotification(`Música adicionada à nova playlist "${newPlaylistName}"!`);
      closeAddToPlaylistModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Não foi possível completar a ação.";
      showNotification(errorMessage, 'error');
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const value = {
    currentSong, isPlaying, progress, duration, volume,
    playSong, togglePlayPause, playNext, playPrevious, handleSeek, handleVolumeChange, formatTime,
    isPlaylistModalOpen, userPlaylists, openAddToPlaylistModal, closeAddToPlaylistModal, handleAddSongToPlaylist, handleCreateAndAdd,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
        onTimeUpdate={() => setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);