import api from './api';

const logSongPlay = (audioId) => {
  // Envia uma requisição POST para registrar que a música foi ouvida
  // Não nos preocupamos com a resposta, é uma ação "dispare e esqueça"
  return api.post('/history', { audioId });
};

const getRecentPlays = async () => {
  const response = await api.get('/history/recent');
  return response.data;
};

export default { 
    logSongPlay,
    getRecentPlays,

 };