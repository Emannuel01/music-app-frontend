import React from 'react';
import Modal from './Modal'; // Reutilizamos nosso componente Modal genérico!
import './LyricsModal.css';

function LyricsModal({ isOpen, onClose, songName, lyrics }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="lyrics-modal-header">
        <h2>{songName}</h2>
        <span>Letra</span>
      </div>

      {/* A classe 'lyrics-content' usará 'white-space' para formatar as quebras de linha */}
      <div className="lyrics-content">
        {lyrics ? lyrics : 'Letra não disponível para esta música.'}
      </div>
    </Modal>
  );
}

export default LyricsModal;