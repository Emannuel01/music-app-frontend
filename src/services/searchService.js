import api from './api';

// Função de busca genérica que agora aceita parâmetros
const search = (params) => {
  if (!params.q) {
    return Promise.resolve({ data: [] }); // Retorna array vazio se não houver query
  }

  let url = '';
  // Se houver um campo (genre, author), usa a rota de filtro
  if (params.field) {
    url = `/audio/filter/${params.field}?q=${params.q}`;
  } else {
    // Senão, usa a busca padrão por nome
    url = `/audio/search?q=${params.q}`;
  }

  return api.get(url);
};

export default {
  search,
};