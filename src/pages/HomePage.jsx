import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import playlistService from '../services/playlistService';
import favoriteService from '../services/favoriteService';
import historyService from '../services/historyService';
import recommendationService from '../services/recommendationService';
import ContentShelf from '../components/ContentShelf';
import PlaylistItem from '../components/PlaylistItem';
import SongItem from '../components/SongItem';
import GenreCard from '../components/GenreCard';

// --- Imagens de Gêneros ---
// Certifique-se de que os caminhos e nomes dos arquivos estão corretos
import sambaImg from '../assets/genres/samba.jpeg'; 
import eletronicaImg from '../assets/genres/eletronic.jpg';

// Lista estática de gêneros para descoberta
const browseGenres = [
  { name: 'Rock',       image: null,       color: '#800000' },
  { name: 'Pop',        image: null,          color: '#3a7bd5' },
  { name: 'Samba',      image: sambaImg,      color: '#f2994a' },
  { name: 'Eletrônica', image: eletronicaImg, color: '#9d50bb' },
  { name: 'Hip Hop',    image: null,          color: '#ff416c' },
  { name: 'Jazz',       image: null,          color: '#00416a' },
];

function HomePage() {
  const { token } = useAuth();
  
  const [displayPlaylists, setDisplayPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserEmpty, setIsUserEmpty] = useState(true);

  useEffect(() => {
    // Apenas busca dados se houver um token
    if (token) {
      setLoading(true);
      
      // Busca todos os dados necessários em paralelo para mais eficiência
      Promise.all([
        playlistService.getMyPlaylists(),
        favoriteService.getMyFavorites(),
        historyService.getRecentPlays(),
        recommendationService.getForYou()
      ]).then(([playlistsData, favoritesData, recentPlaysData, recommendationsData]) => {
        
        // Define se o usuário tem conteúdo personalizado ou não
        const hasContent = playlistsData.length > 0 || favoritesData.length > 0 || recentPlaysData.length > 0;
        setIsUserEmpty(!hasContent);

        // Salva as recomendações no estado
        setRecommendations(recommendationsData);
        
        // Lógica para montar a prateleira de playlists (reais e virtuais)
        if (hasContent) {
          const virtualPlaylists = [];

          // Cria a playlist virtual de "Músicas Curtidas" se houver favoritos
          if (favoritesData.length > 0) {
            virtualPlaylists.push({
              id: 'favorites',
              name: 'Músicas Curtidas',
              description: `${favoritesData.length} músicas`,
              audios: favoritesData,
              isVirtual: true,
              icon: '♥',
            });
          }
          
          // Cria a playlist virtual de "Ouvidas Recentemente" se houver histórico
          if (recentPlaysData.length > 0) {
            virtualPlaylists.push({
              id: 'recent',
              name: 'Ouvidas Recentemente',
              description: `${recentPlaysData.length} músicas`,
              audios: recentPlaysData,
              isVirtual: true,
              icon: '🕒',
            });
          }
          
          // Combina as playlists virtuais com as playlists reais do usuário
          setDisplayPlaylists([...virtualPlaylists, ...playlistsData]);
        }

      }).catch(err => {
        console.error("Não foi possível carregar os dados da Home:", err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // Limpa tudo se o usuário não estiver logado
      setDisplayPlaylists([]);
      setRecommendations([]);
      setIsUserEmpty(true);
      setLoading(false);
    }
  }, [token]);


  // Se o usuário não estiver logado
  if (!token) {
    return (
      <div>
        <h1>Bem-vindo ao MusicApp</h1>
        <p><Link to="/login">Faça login</Link> para começar a sua jornada musical.</p>
      </div>
    );
  }

  // Se estiver carregando os dados iniciais
  if (loading) {
    return <p style={{ color: 'white' }}>Carregando sua home base...</p>;
  }

  return (
    <div>
      <h1>Início</h1>
      
      {isUserEmpty ? (
        // Conteúdo para novos usuários, focado na descoberta
        <div>
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem' }}>
            Parece que está um pouco vazio por aqui. Explore alguns gêneros para começar!
          </p>
          <ContentShelf
            title="Navegar por Gêneros"
            items={browseGenres}
            renderItem={(genre) => <GenreCard key={genre.name} genre={genre} />}
          />
        </div>
      ) : (
        // Conteúdo para usuários existentes, com conteúdo personalizado
        <>
          <ContentShelf
            title="Recomendado para você"
            items={recommendations}
            renderItem={(song) => <SongItem key={song.id} song={song} songList={recommendations} />}
          />

          <ContentShelf
            title="Suas Playlists e Atividades"
            items={displayPlaylists}
            renderItem={(playlist) => (
              <PlaylistItem 
                key={playlist.id} 
                playlist={playlist}
              />
            )}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;