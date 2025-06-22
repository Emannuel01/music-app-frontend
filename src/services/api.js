import axios from 'axios';

// Cria uma instância do axios com uma URL base para nossa API
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

// ISSO É A MÁGICA: Interceptor de Requisições
// Antes de cada requisição ser enviada, esta função é executada.
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token existir, adiciona o cabeçalho de autorização
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; // Permite que a requisição continue
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default api;