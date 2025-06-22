import api from './api';

const updateProfile = async (userData) => {
  // userData será { name: 'Novo Nome' }
  const response = await api.patch('/users/me', userData);
  return response.data;
};

export default { updateProfile };