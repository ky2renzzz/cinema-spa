import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types/cinema';
import { Heart, Trash2 } from 'lucide-react';

interface FavoritesViewProps {
  favoritesMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleFavorite: (e: React.MouseEvent, movie: Movie) => void;
  onClearAll: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoritesMovies,
  onSelectMovie,
  onToggleFavorite,
  onClearAll,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h2 className="text-2xl font-extrabold text-white">
            Избранные фильмы и сериалы
          </h2>
          <span className="text-xs font-mono bg-red-950/80 text-red-400 border border-red-800 px-2.5 py-1 rounded-full">
            {favoritesMovies.length}
          </span>
        </div>

        {favoritesMovies.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Очистить список
          </button>
        )}
      </div>

      {favoritesMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {favoritesMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-3">
          <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Список избранного пуст</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Нажимайте сердечко на карточке фильма или в описании, чтобы сохранять понравившееся кино для быстрого просмотра.
          </p>
        </div>
      )}
    </div>
  );
};
