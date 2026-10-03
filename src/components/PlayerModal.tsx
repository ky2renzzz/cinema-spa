import React, { useState } from 'react';
import { X, Play, RefreshCw, Star, Heart, Share2, AlertCircle, ExternalLink, ShieldCheck, Film } from 'lucide-react';
import { Movie } from '../types/cinema';
import { CDN_PROVIDERS } from '../services/apiService';

interface PlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  movie,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!movie) return null;

  const [activeProviderId, setActiveProviderId] = useState<string>(CDN_PROVIDERS[0].id);
  const [currentKpId, setCurrentKpId] = useState<number>(movie.kinopoiskId);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentProvider = CDN_PROVIDERS.find((p) => p.id === activeProviderId) || CDN_PROVIDERS[0];
  const playerUrl = currentProvider.getUrl(currentKpId, movie.imdbId);

  const handleProviderChange = (providerId: string) => {
    setActiveProviderId(providerId);
    setShowTrailer(false);
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      {/* Backdrop overlay click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl z-10 flex flex-col my-auto max-h-[95vh] divide-y divide-zinc-800/60">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 flex-shrink-0">
              <Play className="w-5 h-5 fill-red-500 ml-0.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {movie.nameRu}
              </h2>
              <p className="text-xs text-zinc-400 truncate flex items-center gap-2">
                <span>{movie.year}</span>
                <span>•</span>
                <span>ID Кинопоиск: <strong className="text-amber-400 font-mono">{currentKpId}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(movie)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-red-950 border-red-800 text-red-400'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={isFavorite ? 'Из избранного' : 'В избранное'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all relative"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-8 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                  Скопировано!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/80 border border-zinc-800 hover:border-red-800 text-zinc-400 hover:text-red-400 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CDN Provider Selector / Fallback Switcher */}
        <div className="bg-zinc-900/90 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Провайдеры CDN:
            </span>
            {CDN_PROVIDERS.map((provider) => {
              const active = !showTrailer && activeProviderId === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 scale-105'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{provider.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => setShowTrailer(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                showTrailer
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-amber-400 border border-zinc-800'
              }`}
            >
              <span>Трейлер HD</span>
            </button>
          </div>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-all flex-shrink-0"
            title="Перезагрузить плеер"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center z-10 gap-3">
              <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-zinc-400 font-medium">
                Загрузка CDN потока ({showTrailer ? 'Трейлер' : currentProvider.name})...
              </p>
            </div>
          )}

          {showTrailer ? (
            <iframe
              key={`trailer-${movie.id}`}
              src={`https://www.youtube.com/embed?search=${encodeURIComponent(movie.nameRu + ' трейлер')}`}
              title="Трейлер"
              className="w-full h-full border-0"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <iframe
              key={`${activeProviderId}-${iframeKey}-${currentKpId}`}
              src={playerUrl}
              title={movie.nameRu}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>

        {/* Fallback Notice & Kinopoisk ID Quick Modifier */}
        <div className="bg-zinc-900/40 p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Плеер автоматически содержит озвучки, субтитры, качество 1080p и выбор серий. Не работает? Переключите плеер 1–5 выше.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-zinc-400">Изменить ID:</span>
            <input
              type="number"
              value={currentKpId}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val) setCurrentKpId(val);
              }}
              className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Movie Info Section */}
        <div className="p-6 overflow-y-auto max-h-72 space-y-4 bg-zinc-950">
          <div className="flex flex-wrap items-center gap-2">
            {movie.ratingKinopoisk && (
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Кинопоиск {movie.ratingKinopoisk}
              </span>
            )}
            {movie.ratingImdb && (
              <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg font-bold text-xs">
                IMDb {movie.ratingImdb}
              </span>
            )}
            {movie.genres.map((g) => (
              <span key={g} className="px-2.5 py-1 bg-zinc-900 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-800">
                {g}
              </span>
            ))}
            <span className="px-2.5 py-1 bg-zinc-900 text-zinc-400 rounded-lg text-xs font-mono border border-zinc-800">
              {movie.countries.join(', ')}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Описание сюжета
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              {movie.description || 'Описание фильма временно отсутствует.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
