import { Movie, CdnProvider } from '../types/cinema';
import { POPULAR_MOVIES } from '../data/mockMovies';

const KINOPOISK_API_KEY_DEFAULT = '8c86825c-07a6-4f82-a4db-b09f10e35965'; // Public test key

export const CDN_PROVIDERS: CdnProvider[] = [
  {
    id: 'kollam',
    name: 'Плеер 1 (Collaps / Kollam)',
    badge: 'HD / 4K • Все озвучки',
    getUrl: (kpId: number) => `https://kollam.net/embed/kinopoisk/${kpId}`,
  },
  {
    id: 'kinobox',
    name: 'Плеер 2 (Kinobox)',
    badge: 'Быстрый • Субтитры',
    getUrl: (kpId: number) => `https://kinobox.in/embed/kp/${kpId}`,
  },
  {
    id: 'svcdn',
    name: 'Плеер 3 (SvCDN)',
    badge: 'Стабильный • Мобильный',
    getUrl: (kpId: number) => `https://2415.svcdn.in/embed/${kpId}`,
  },
  {
    id: 'alloha',
    name: 'Плеер 4 (Alloha)',
    badge: 'Сезоны / Серии',
    getUrl: (kpId: number) => `https://api.alloha.tv/?token=2b498f3b7d301b7a2d6771d31d0442&kp=${kpId}`,
  },
  {
    id: 'vidsrc',
    name: 'Плеер 5 (Vidsrc IMDb)',
    badge: 'ENG / Оригинал',
    getUrl: (kpId: number, imdbId?: string) => 
      imdbId ? `https://vidsrc.me/embed/movie/${imdbId}` : `https://vidsrc.me/embed/movie/${kpId}`,
  },
];

export const cinemaService = {
  // Live Search with fallback to mock data
  async searchMovies(query: string, apiKey?: string): Promise<Movie[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const key = apiKey || KINOPOISK_API_KEY_DEFAULT;

    try {
      const response = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}&page=1`,
        {
          headers: {
            'X-API-KEY': key,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.films && Array.isArray(data.films) && data.films.length > 0) {
          return data.films.slice(0, 16).map((f: any) => ({
            id: f.filmId || f.kinopoiskId,
            kinopoiskId: f.filmId || f.kinopoiskId,
            imdbId: f.imdbId,
            nameRu: f.nameRu || f.nameEn || 'Без названия',
            nameEn: f.nameEn || '',
            year: parseInt(f.year) || new Date().getFullYear(),
            posterUrl: f.posterUrl || f.posterUrlPreview,
            posterUrlPreview: f.posterUrlPreview || f.posterUrl,
            ratingKinopoisk: parseFloat(f.rating) || 7.5,
            description: f.description || f.slogan || 'Описание недоступно.',
            type: f.type === 'TV_SERIES' || f.type === 'MINI_SERIES' ? 'TV_SERIES' : 'FILM',
            genres: f.genres ? f.genres.map((g: any) => g.genre) : ['Фильм'],
            countries: f.countries ? f.countries.map((c: any) => c.country) : ['Неизвестно'],
            filmLength: f.filmLength,
          }));
        }
      }
    } catch (err) {
      console.warn('API Search failed or restricted by CORS, falling back to offline search:', err);
    }

    // Local fuzzy search fallback
    return POPULAR_MOVIES.filter(
      (m) =>
        m.nameRu.toLowerCase().includes(q) ||
        (m.nameEn && m.nameEn.toLowerCase().includes(q)) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.year.toString().includes(q)
    );
  },

  // Get catalog movies
  async getCatalog(category: string = 'all', genre: string = 'all'): Promise<Movie[]> {
    let list = [...POPULAR_MOVIES];

    if (category === 'films') {
      list = list.filter((m) => m.type === 'FILM');
    } else if (category === 'series') {
      list = list.filter((m) => m.type === 'TV_SERIES');
    } else if (category === 'anime') {
      list = list.filter((m) => m.type === 'ANIME');
    }

    if (genre !== 'all') {
      list = list.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    return list;
  },

  // Search by exact Kinopoisk ID entered manually by user
  createMovieFromId(kpId: number): Movie {
    return {
      id: kpId,
      kinopoiskId: kpId,
      nameRu: `Фильм #${kpId}`,
      year: new Date().getFullYear(),
      posterUrl: `https://kinopoiskapiunofficial.tech/images/posters/kp/${kpId}.jpg`,
      posterUrlPreview: `https://kinopoiskapiunofficial.tech/images/posters/kp_small/${kpId}.jpg`,
      ratingKinopoisk: 8.0,
      description: `Пользовательский просмотр по Kinopoisk ID: ${kpId}. Видеоплеер автоматически загружает доступный медиаконтент через CDN.`,
      type: 'FILM',
      genres: ['Онлайн Смотр'],
      countries: ['Все страны'],
    };
  }
};
