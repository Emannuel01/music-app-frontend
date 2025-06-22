import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css'; // Vamos criar este CSS

function ProfilePage() {
  const { user } = useAuth(); // Pega os dados do usuário do contexto

  if (!user) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div className="profile-page">
      <h1>Perfil</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          <span>👤</span>
        </div>
        <div className="profile-info">
          <div className="info-item">
            <label>Nome</label>
            <span>{user.name}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* Futuramente, aqui entrarão as opções de configuração */}
      <div className="profile-settings">
        <h2>Configurações (em breve)</h2>
        <p>Área para futuras funcionalidades, como alterar senha.</p>
      </div>
    </div>
  );
}

export default ProfilePage;