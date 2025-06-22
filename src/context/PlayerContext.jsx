import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import playlistService from '../services/playlistService';
import { useNotification } from './NotificationContext.jsx';

const PlayerContext = createContext(null);

// --- LÓGICA DE PERSISTÊNCIA DO VOLUME ---
const VOLUME_STORAGE_KEY = 'musicapp-volume';
const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 1;


export const PlayerProvider = ({ children }) => {
  const { showNotification } = useNotification();

  // --- ESTADOS ---
  // Player
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  
  // Fila de Reprodução
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // Modal de "Adicionar à Playlist"
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Referência ao elemento <audio>
  const audioRef = useRef(null);

  // --- EFEITOS ---

  // Efeito para tocar a música quando 'currentSong' muda
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(error => {
        // Mostra uma notificação amigável se o arquivo de áudio não for encontrado no servidor
        console.error("Erro ao iniciar o play:", error);
        showNotification("Erro ao carregar a música. O arquivo pode não existir.", 'error');
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // Efeito para salvar o volume no localStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


  // --- FUNÇÕES DE CONTROLE DO PLAYER ---

  const playSong = (song, songList = []) => {
    const songUrl = `${import.meta.env.VITE_BACKEND_URL}/api/audio/${song.id}/play`;
    
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

  // --- FUNÇÕES DO MODAL ---

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
      showNotification("Não foi possível carregar suas playlists.", error);
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

  // Valor que será compartilhado com toda a aplicação
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

export const usePlayer = () => {
  return useContext(PlayerContext);
};