import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../context/NotificationContext.jsx'; // 1. IMPORTA O HOOK DE NOTIFICAÇÃO
import './AuthForm.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // 2. PEGA A FUNÇÃO PARA SER USADA

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showNotification("Todos os campos são obrigatórios.", "error");
      return;
    }
    setLoading(true);

    try {
      const data = await authService.register(formData);
      // Agora usa a notificação de sucesso
      showNotification(data.message, "success");
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao criar conta.";
      // E também a de erro
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>

        <div className="form-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="password"
            placeholder="Senha"
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Criando...' : 'CADASTRAR'}
        </button>

        <p style={{ color: '#b3b3b3', marginTop: '1.5rem', textAlign: 'center' }}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;