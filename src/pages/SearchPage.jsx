// frontend/src/pages/SearchPage.jsx
 import React, { useState, useEffect } from 'react';
 import { useSearchParams } from 'react-router-dom';
 import searchService from '../services/searchService';
 import SongItem from '../components/SongItem';
 import './SearchPage.css';

 function SearchPage() {
   const [searchParams, setSearchParams] = useSearchParams();
   const query = searchParams.get('q') || '';
   const field = searchParams.get('field') || '';

   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);

   const handleInputChange = (e) => {
     const newQuery = e.target.value;
     const currentField = searchParams.get('field');
     if (newQuery) {
       setSearchParams(currentField ? { q: newQuery, field: currentField } : { q: newQuery });
     } else {
       setSearchParams({});
     }
   };

   useEffect(() => {
     if (query.trim() === '') {
       setResults([]);
       return;
     }
     setLoading(true);
     const delayDebounceFn = setTimeout(() => {
       searchService.search({ q: query, field: field })
         .then(response => {
           setResults(response.data);
         })
         .catch(error => console.error("Erro na busca:", error))
         .finally(() => setLoading(false));
     }, 500);
     return () => clearTimeout(delayDebounceFn);
   }, [query, field]);

   return (
     <div className="search-page-container">
       <h1>Buscar</h1>
       <div className="search-bar">
         <input
           type="search"
           placeholder="O que você quer ouvir?"
           value={query}
           onChange={handleInputChange}
         />
       </div>
       <div className="search-results">
         {loading && <p>Buscando...</p>}
         {!loading && results.length > 0 && (
           <ul>
             {results.map(song => (
               <SongItem key={song.id} song={song} songList={results} />
             ))}
           </ul>
         )}
         {!loading && results.length === 0 && query.trim() !== '' && (
           <p>Nenhum resultado encontrado para "{query}".</p>
         )}
       </div>
     </div>
   );
 }
 export default SearchPage;