import React, { useState, useEffect, useRef } from 'react';
import { Search, Film, Tv, Sparkles, Heart, Hash, X, Play, Info } from 'lucide-react';
import { Movie } from '../types/cinema';
import { cinemaService } from '../services/apiService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectMovie: (movie: Movie) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectMovie,
  favoritesCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [kpIdInput, setKpIdInput] = useState('');
  const [showIdModal, setShowIdModal] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await cinemaService.searchMovies(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleManualIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(kpIdInput.trim());
    if (idNum && !isNaN(idNum)) {
      const customMovie = cinemaService.createMovieFromId(idNum);
      onSelectMovie(customMovie);
      setShowIdModal(false);
      setKpIdInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('all')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  CINEMA<span className="text-red-500">SPA</span>
                </span>
                <span className="block text-[9px] font-mono text-zinc-400 tracking-widest uppercase">
                  Free Player & No Backend
                </span>
              </div>
            </button>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveTab('films')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'films'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Film className="w-4 h-4 text-red-400" />
                Фильмы
              </button>
              <button
                onClick={() => setActiveTab('series')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'series'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Tv className="w-4 h-4 text-amber-400" />
                Сериалы
              </button>
              <button
                onClick={() => setActiveTab('anime')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'anime'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Аниме
              </button>
            </nav>
          </div>

          {/* Search Bar & Direct Kinopoisk ID */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск фильмов, сериалов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="w-full bg-zinc-900/90 text-zinc-100 text-sm pl-10 pr-9 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-zinc-500"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-zinc-800/50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    Ищем видеоконтент...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        onSelectMovie(movie);
                        setShowResults(false);
                      }}
                      className="w-full text-left p-3 hover:bg-zinc-800/80 flex items-center gap-3 transition-colors group"
                    >
                      <img
                        src={movie.posterUrlPreview || movie.posterUrl}
                        alt={movie.nameRu}
                        className="w-10 h-14 object-cover rounded-md bg-zinc-800 flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm truncate group-hover:text-red-400 transition-colors">
                            {movie.nameRu}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {movie.year}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {movie.genres.join(', ')}
                        </p>
                        {movie.ratingKinopoisk && (
                          <span className="inline-block text-[11px] font-bold text-emerald-400 mt-1">
                            ★ {movie.ratingKinopoisk} KP
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-400">
                    Ничего не найдено по запросу «{searchQuery}».
                    <button
                      onClick={() => {
                        setShowIdModal(true);
                        setShowResults(false);
                      }}
                      className="block mx-auto mt-2 text-xs text-red-400 hover:underline"
                    >
                      Ввести Kinopoisk ID вручную?
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIdModal(true)}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 transition-all shadow-sm"
              title="Ввести Kinopoisk ID напрямую"
            >
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ввести ID</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`p-2 rounded-xl relative transition-all border ${
                activeTab === 'favorites'
                  ? 'bg-red-950/60 border-red-800 text-red-400'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Избранные фильмы"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Kinopoisk ID Direct Input Modal */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowIdModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Открыть фильм по Kinopoisk ID</h3>
                <p className="text-xs text-zinc-400">Прямая подгрузка плеера по уникальному ID</p>
              </div>
            </div>

            <form onSubmit={handleManualIdSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ID фильма с Кинопоиска (например: 258687)
                </label>
                <input
                  type="number"
                  placeholder="258687"
                  value={kpIdInput}
                  onChange={(e) => setKpIdInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>
                  Где взять ID? Из ссылки на Кинопоиске: <code className="text-amber-400 font-mono">kinopoisk.ru/film/<b>258687</b>/</code>
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowIdModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/30"
                >
                  Запустить плеер
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
