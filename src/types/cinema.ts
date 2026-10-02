export interface Movie {
  id: number;
  kinopoiskId: number;
  imdbId?: string;
  nameRu: string;
  nameEn?: string;
  year: number;
  posterUrl: string;
  posterUrlPreview?: string;
  backdropUrl?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  description?: string;
  shortDescription?: string;
  filmLength?: string;
  type: 'FILM' | 'TV_SERIES' | 'MINI_SERIES' | 'ANIME';
  genres: string[];
  countries: string[];
  slogan?: string;
}

export type CdnProvider = {
  id: string;
  name: string;
  badge: string;
  getUrl: (kpId: number, imdbId?: string) => string;
};
