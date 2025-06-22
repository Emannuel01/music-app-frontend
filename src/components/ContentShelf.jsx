import React from 'react';
import './ContentShelf.css';

function ContentShelf({ title, items, renderItem }) {
  // Se não houver itens, não renderiza nada
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="shelf-section">
      <h2 className="shelf-title">{title}</h2>
      <div className="shelf-grid">
        {/* Mapeia os itens e usa a função 'renderItem' para decidir como renderizar cada um */}
        {items.map(item => renderItem(item))}
      </div>
    </section>
  );
}

export default ContentShelf;