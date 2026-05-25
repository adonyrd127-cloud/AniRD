const NodeCache = require("node-cache");

// TTL en segundos: datos de temporada (10 min), búsquedas (5 min)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const TTLS = {
  SEASON: 600,      // 10 min — datos de temporada cambian poco
  SEARCH: 300,      // 5 min — resultados de búsqueda
  ANIME_DETAIL: 900 // 15 min — detalles de anime son muy estables
};

module.exports = { cache, TTLS };
