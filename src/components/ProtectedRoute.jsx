import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { token } = useAuth(); // Pega o token do nosso contexto de autenticação

  // Se NÃO houver token, redireciona o usuário para a página de login
  if (!token) {
    // O 'replace' evita que o usuário possa usar o botão "voltar" do navegador para acessar a página protegida
    return <Navigate to="/login" replace />;
  }

  // Se houver um token, renderiza o conteúdo da rota filha (a página que o usuário quer acessar)
  return <Outlet />;
}

export default ProtectedRoute;