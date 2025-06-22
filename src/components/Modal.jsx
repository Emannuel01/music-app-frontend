import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    // O fundo escurecido
    <div className="modal-overlay" onClick={onClose}>
      {/* O container do modal, que impede o fechamento ao clicar dentro dele */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;