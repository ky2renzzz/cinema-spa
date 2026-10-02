import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types/cinema';
import { Film, Filter } from 'lucide-react';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  favorites: number[];
  onToggleFavorite: (e: React.MouseEvent, movie: Movie) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

const GENRES = [
  'Все',
  'Фантастика',
  'Боевик',
  'Драма',
  'Комедия',
  'Приключения',
  'Мультфильм',
  'Триллер',
  'Фэнтези',
  'Криминал'
];

export const MovieGrid: React.FC<MovieGridProps> = ({
  title,
  movies,
  onSelectMovie,
  favorites,
  onToggleFavorite,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <section className="space-y-6">
      {/* Header and Genre Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-red-500" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
            {movies.length}
          </span>
        </div>

        {/* Genre Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-zinc-400 flex-shrink-0 mr-1" />
          {GENRES.map((g) => {
            const val = g === 'Все' ? 'all' : g;
            const active = selectedGenre === val;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800/80 rounded-3xl">
          <p className="text-zinc-400 text-sm">Фильмы по выбранному фильтру не найдены.</p>
          <button
            onClick={() => setSelectedGenre('all')}
            className="mt-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-xl"
          >
            Сбросить фильтр
          </button>
        </div>
      )}
    </section>
  );
};
