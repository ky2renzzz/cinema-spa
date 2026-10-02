import React from 'react';
import { Play, Star, Heart } from 'lucide-react';
import { Movie } from '../types/cinema';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-red-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl hover:shadow-red-950/30 flex flex-col h-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.posterUrlPreview || movie.posterUrl}
          alt={movie.nameRu}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Rating Badge */}
        {movie.ratingKinopoisk && (
          <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-700/60 flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-extrabold text-white">
              {movie.ratingKinopoisk}
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-zinc-300 border border-zinc-800">
          {movie.type === 'TV_SERIES' ? 'Сериал' : movie.type === 'ANIME' ? 'Аниме' : 'Фильм'}
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={(e) => onToggleFavorite(e, movie)}
          className={`absolute bottom-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all opacity-0 group-hover:opacity-100 ${
            isFavorite
              ? 'bg-red-950/90 border-red-700 text-red-400 opacity-100'
              : 'bg-zinc-950/80 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
          }`}
          title={isFavorite ? 'Удалить из избранного' : 'В избранное'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Hover Play Icon Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.nameRu}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
            <span>{movie.year}</span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{movie.genres[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
