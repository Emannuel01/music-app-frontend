// frontend/src/pages/UploadPage.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './UploadPage.css'; // Importa nosso novo estilo

function UploadPage() {
  const [formState, setFormState] = useState({
    music_name: '',
    author: '',
    year: '',
    genre: '',
    lyrics: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs para os inputs de arquivo escondidos
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'audiofile') {
      setAudioFile(e.target.files[0]);
    } else {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setStatus('Por favor, selecione um arquivo de áudio.');
      return;
    }
    setStatus('Enviando...');
    setLoading(true);

    const data = new FormData();
    // Adiciona os campos de texto
    for (const key in formState) {
      data.append(key, formState[key]);
    }
    // Adiciona os arquivos
    data.append('audiofile', audioFile);
    if (imageFile) {
      data.append('imagefile', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/audio/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setStatus(`Sucesso! ${response.data.message}`);
    } catch (error) {
      setStatus(`Falha no upload: ${error.response?.data?.message || error.message}`);
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
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
}

export default UploadPage;