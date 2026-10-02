import React from 'react';
import { Play, Info, Heart, Star, Sparkles } from 'lucide-react';
import { Movie } from '../types/cinema';

interface HeroBannerProps {
  movie: Movie;
  onWatch: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onWatch,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden mb-10 shadow-2xl border border-zinc-800/80 group">
      {/* Background Image */}
      <img
        src={movie.backdropUrl || movie.posterUrl}
        alt={movie.nameRu}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-3xl z-10 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Тренды недели
          </span>
          <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-300 text-xs font-semibold">
            {movie.year}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-emerald-400" /> KP {movie.ratingKinopoisk}
          </span>
          {movie.filmLength && (
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 text-zinc-400 text-xs font-mono">
              {movie.filmLength}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
          {movie.nameRu}
        </h1>

        {movie.nameEn && (
          <p className="text-sm font-medium text-zinc-400 font-mono">
            {movie.nameEn}
          </p>
        )}

        <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-2xl font-normal">
          {movie.description}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onWatch(movie)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-red-600/40 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white" />
            Смотреть онлайн
          </button>

          <button
            onClick={() => onWatch(movie)}
            className="px-5 py-3 bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-200 text-sm font-semibold rounded-2xl border border-zinc-700/80 backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <Info className="w-5 h-5 text-zinc-400" />
            Подробнее
          </button>

          <button
            onClick={() => onToggleFavorite(movie)}
            className={`p-3 rounded-2xl backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-red-950/80 border-red-700 text-red-400'
                : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-white'
            }`}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
