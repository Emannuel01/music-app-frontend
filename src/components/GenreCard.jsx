// frontend/src/components/GenreCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './GenreCard.css';

function GenreCard({ genre }) {
  // O estilo agora usa a imagem como fundo do card
  const cardStyle = {
    backgroundImage: `url(${genre.image})`,
  };

  return (
    <Link to={`/search?field=genre&q=${genre.name}`} className="genre-card-link">
      <div className="genre-card" style={cardStyle}>
        {/* Adicionamos um 'overlay' para garantir a legibilidade do texto */}
        <div className="genre-card-overlay">
          <h3>{genre.name}</h3>
        </div>
      </div>
    </Link>
  );
}

export default GenreCard;