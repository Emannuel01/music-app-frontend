import api from './api';

const getMyFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
};

const addFavorite = async (audioId) => {
    const response = await api.post(`/audio/${audioId}/like`);
    return response.data;
};

const unlikeAudio = async (audioId) => {
    const response = await api.delete(`/audio/${audioId}/like`);
    return response.data;
};

export default { getMyFavorites, addFavorite, unlikeAudio };