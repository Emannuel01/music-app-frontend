import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { token, user, logout } = useAuth();
  
  // Estado para controlar o dropdown do perfil de usuário
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // --- NOVO: Estado para controlar o menu mobile ---
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const userDropdownRef = useRef(null);

  // Lógica para fechar o dropdown do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Função para garantir que os menus fechem ao fazer logout
  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  // Função para fechar o menu mobile ao clicar em um link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          🎵 Musics'
        </Link>

        {token && (
          <>
            {/* Navegação principal para Desktop */}
            <nav className="header-nav">
              <NavLink to="/">Início</NavLink>
              <NavLink to="/search">Buscar</NavLink>
              <NavLink to="/playlists">Minhas Playlists</NavLink>
              <NavLink to="/upload">Upload</NavLink>
            </nav>

            {/* Menu do perfil de usuário para Desktop */}
            <div className="header-user-menu" ref={userDropdownRef}>
              <div className="user-profile" onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}>
                <span className="user-avatar">👤</span>
                <span className="user-name">{firstName}</span>
                <span className="dropdown-arrow">{isUserDropdownOpen ? '▲' : '▼'}</span>
              </div>

              {isUserDropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>Perfil</Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>Configurações</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">Sair</button>
                </div>
              )}
            </div>
            
            {/* Botão Hambúrguer para Mobile */}
            <button className="hamburger-menu" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? '×' : '☰'}
            </button>
          </>
        )}
      </div>

      {/* Navegação Mobile (Dropdown) */}
      {token && (
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMobileMenu}>Início</NavLink>
          <NavLink to="/search" onClick={closeMobileMenu}>Buscar</NavLink>
          <NavLink to="/playlists" onClick={closeMobileMenu}>Minhas Playlists</NavLink>
          <NavLink to="/upload" onClick={closeMobileMenu}>Upload</NavLink>
          <div className="mobile-nav-divider"></div>
          {/* Adicionamos o botão de sair no menu mobile também */}
          <button onClick={handleLogout} className="mobile-logout-button">Sair</button>
        </nav>
      )}
    </header>
  );
}

export default Header;