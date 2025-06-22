import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import userService from '../services/userService';
import './SettingsPage.css'; // Importa nosso novo arquivo de estilo

function SettingsPage() {
  const { user, updateUserData } = useAuth();
  const { showNotification } = useNotification();
  
  // Estado para o formulário de edição de nome
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.updateProfile({ name });
      updateUserData(response.user);
      showNotification(response.message, 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erro ao atualizar perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p style={{ color: 'white' }}>Carregando perfil...</p>;
  }

  return (
    <div className="settings-page">
      <h1>Configurações</h1>

      {/* Seção para Editar o Perfil */}
      <section className="settings-section">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome de Usuário</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </section>

      {/* Seção com Informações da Conta */}
      <section className="settings-section">
        <h2>Informações da Conta</h2>
        <div className="form-group">
          <label>Email</label>
          <div className="read-only-field">{user.email}</div>
        </div>
      </section>

      {/* Seção de Perigo para futuras funcionalidades */}
      <section className="settings-section danger-zone">
        <h2>Zona de Perigo</h2>
        <p>Ações nesta área são permanentes e não podem ser desfeitas.</p>
        <button className="button-danger" disabled>Deletar Conta (em breve)</button>
      </section>

    </div>
  );
}

export default SettingsPage;