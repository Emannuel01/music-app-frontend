import api from './api';

const getForYou = async () => {
  const response = await api.get('/recommendations/for-you');
  return response.data;
};

export default { getForYou };