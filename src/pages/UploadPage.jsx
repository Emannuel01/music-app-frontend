import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import './UploadPage.css';

function UploadPage() {
  const { showNotification } = useNotification();
  
  // CORREÇÃO: Estado inicializado corretamente
  const [formState, setFormState] = useState({
    music_name: '',
    author: '',
    year: '',
    genre: '',
    lyrics: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'audiofile') {
      setAudioFile(files[0]);
    } else {
      setImageFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      showNotification('Por favor, selecione um arquivo de áudio.', 'error');
      return;
    }
    setLoading(true);

    const data = new FormData();
    // Adiciona os campos de texto
    Object.keys(formState).forEach(key => {
      data.append(key, formState[key]);
    });
    // Adiciona os arquivos
    data.append('audiofile', audioFile);
    if (imageFile) {
      data.append('imagefile', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/audio/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      showNotification('Música enviada com sucesso!', 'success');
      // Limpa o formulário após o sucesso
      e.target.reset();
      setAudioFile(null);
      setImageFile(null);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Falha no upload.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-form-container">
        <h1>Upload de Nova Música</h1>
        <form onSubmit={handleSubmit}>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="music_name">Nome da Música</label>
              <input id="music_name" name="music_name" className="form-input" placeholder="Ex: Stairway to Heaven" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="author">Artista</label>
              <input id="author" name="author" className="form-input" placeholder="Ex: Led Zeppelin" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="year">Ano</label>
              <input id="year" name="year" type="number" className="form-input" placeholder="Ex: 1971" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="genre">Gênero</label>
              <input id="genre" name="genre" className="form-input" placeholder="Ex: Rock, Folk" onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lyrics">Letra da Música</label>
            <textarea id="lyrics" name="lyrics" className="form-textarea" placeholder="Comece a digitar a letra aqui..." onChange={handleChange} rows="10"></textarea>
          </div>
          
          <div className="file-input-group">
            <label>Arquivo de Áudio (MP3)</label>
            <div>
              <input name="audiofile" type="file" accept="audio/mpeg" onChange={handleFileChange} required ref={audioInputRef} style={{ display: 'none' }} />
              <button type="button" className="custom-file-input" onClick={() => audioInputRef.current.click()}>Escolher Arquivo</button>
              <span className="file-name">{audioFile ? audioFile.name : 'Nenhum arquivo selecionado'}</span>
            </div>
          </div>

          <div className="file-input-group">
            <label>Capa do Álbum (Imagem)</label>
            <div>
              <input name="imagefile" type="file" accept="image/*" onChange={handleFileChange} ref={imageInputRef} style={{ display: 'none' }} />
              <button type="button" className="custom-file-input" onClick={() => imageInputRef.current.click()}>Escolher Imagem</button>
              <span className="file-name">{imageFile ? imageFile.name : 'Nenhuma imagem selecionada'}</span>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Música'}</button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;