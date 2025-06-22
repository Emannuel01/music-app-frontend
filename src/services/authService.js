import axios from 'axios';

// URL base da nossa API que está rodando no back-end
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

/**
 * Função que envia as credenciais para a API e tenta fazer o login.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} - Os dados retornados pela API (incluindo o token).
 */
const login = async (email, password) => {
  // Faz uma requisição POST para a rota /login da nossa API
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  // Se o login for bem-sucedido, a API retorna dados (incluindo o token).
  // Nós retornamos esses dados para quem chamou a função.
  return response.data;
};

const register = async (userData) => {
  // userData será um objeto com { name, email, password }
  // Usamos axios diretamente aqui porque esta rota não precisa de token de autenticação
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export default {
  login,
  register,
};