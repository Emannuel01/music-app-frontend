import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import { useAuth } from '../context/AuthContext'; // Nosso hook de autenticação
import { Link } from 'react-router-dom';
import './AuthForm.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth(); // Pega a função de login do nosso contexto
  const navigate = useNavigate(); // Hook para navegar entre as páginas

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Agora chamamos a função 'login' do contexto
      await login(email, password);
      // Se o login for bem-sucedido, navega para a página inicial
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao tentar fazer login.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* O JSX do formulário continua o mesmo */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Entrando...' : 'LOGIN'}
        </button>

        <p style={{ color: '#b3b3b3', marginTop: '1.5rem', textAlign: 'center' }}>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;