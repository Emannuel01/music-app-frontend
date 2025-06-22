// frontend/src/services/playlistService.js
import api from './api';

const getMyPlaylists = async () => {
  const response = await api.get('/playlists');
  return response.data;
};

const createPlaylist = async (playlistData) => {
  const response = await api.post('/playlists', playlistData);
  return response.data;
};

const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/playlists/${playlistId}`);
  return response.data;
};

const getPlaylistById = async (id) => {
  const response = await api.get(`/playlists/${id}`);
  return response.data;
};

const addSongToPlaylist = async ({ playlistId, audioId }) => {
  const response = await api.post(`/playlists/${playlistId}/audios`, { audioId });
  return response.data;
};
const removeSongFromPlaylist = async ({ playlistId, audioId }) => {
  const response = await api.delete(`/playlists/${playlistId}/audios/${audioId}`);
  return response.data;
};

const updatePlaylist = async (playlistId, playlistData) => {
  const response = await api.patch(`/playlists/${playlistId}`, playlistData);
  return response.data;
};

export default { 
  getMyPlaylists, 
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylist,
};