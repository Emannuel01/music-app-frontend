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

// Suas imagens de Gêneros
import sambaImg from '../assets/genres/samba.jpeg'; 
import eletronicaImg from '../assets/genres/eletronic.jpg';
// Adicione outros imports se necessário

const browseGenres = [
  { name: 'Rock',       image: null,          color: '#800000' },
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
    if (token) {
      setLoading(true);
      
      Promise.all([
        playlistService.getMyPlaylists(),
        favoriteService.getMyFavorites(),
        historyService.getRecentPlays(),
        recommendationService.getForYou() 
      ]).then(([playlistsData, favoritesData, recentPlaysData, recommendationsData]) => {
        
        // --- CORREÇÃO AQUI ---
        // A condição agora verifica todos os 3 tipos de dados para decidir se o usuário é "vazio"
        const hasContent = playlistsData.length > 0 || favoritesData.length > 0 || recentPlaysData.length > 0;
        setIsUserEmpty(!hasContent);

        setRecommendations(recommendationsData);
        
        if (hasContent) {
          const virtualPlaylists = [];

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
          
          // Monta a lista final que será exibida
          setDisplayPlaylists([...virtualPlaylists, ...playlistsData]);
        }

      }).catch(err => {
        console.error("Não foi possível carregar os dados da Home:", err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // Limpa os estados no logout
      setDisplayPlaylists([]);
      setRecommendations([]);
      setIsUserEmpty(true);
      setLoading(false);
    }
  }, [token]);

  // Se o usuário não estiver logado
  if (!token) {
    return (
      <div style={{ color: 'white', padding: '2rem' }}>
        <h1>Bem-vindo ao MusicApp</h1>
        <p><Link to="/login">Faça login</Link> para começar a sua jornada musical.</p>
      </div>
    );
  }

  // Se estiver carregando os dados
  if (loading) {
    return <p style={{ color: 'white' }}>Carregando sua home base...</p>;
  }

  return (
    <div>
      <h1>Início</h1>
      
      {isUserEmpty ? (
        // Conteúdo para novos usuários
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
        // Conteúdo para usuários existentes
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