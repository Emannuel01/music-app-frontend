import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

// Tenta pegar os dados salvos no localStorage ao iniciar o app
const initialToken = localStorage.getItem('token');
const initialUser = JSON.parse(localStorage.getItem('user')); // Converte a string de volta para objeto

export const AuthProvider = ({ children }) => {
  // Inicia os estados com os valores salvos
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      
      // Salva tanto o token quanto os dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Converte o objeto para string para salvar

    } catch (error) {
      console.error("Falha no login do context", error);
      throw error;
    }
  };

  const updateUserData = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Remove ambos os itens no logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = { token, user, login, logout, updateUserData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



export const useAuth = () => {
  return useContext(AuthContext);
};