import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { FavoritesView } from './components/FavoritesView';
import { PlayerModal } from './components/PlayerModal';
import { Footer } from './components/Footer';
import { Movie } from './types/cinema';
import { cinemaService } from './services/apiService';
import { POPULAR_MOVIES } from './data/mockMovies';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [movies, setMovies] = useState<Movie[]>(POPULAR_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Favorites state from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cinema_favorites');
      return saved ? JSON.parse(saved) : [258687, 4444572]; // Default favorites
    } catch {
      return [258687, 4444572];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinema_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Load catalog based on tab & genre
  useEffect(() => {
    const fetchCatalog = async () => {
      const list = await cinemaService.getCatalog(activeTab, selectedGenre);
      setMovies(list);
    };
    fetchCatalog();
  }, [activeTab, selectedGenre]);

  const toggleFavorite = (e: React.MouseEvent | Movie, movieArg?: Movie) => {
    let targetMovie: Movie;
    if ('id' in e) {
      targetMovie = e as Movie;
    } else {
      e.stopPropagation();
      targetMovie = movieArg!;
    }

    if (!targetMovie) return;

    setFavorites((prev) =>
      prev.includes(targetMovie.id)
        ? prev.filter((id) => id !== targetMovie.id)
        : [...prev, targetMovie.id]
    );
  };

  const favoriteMovies = useMemo(() => {
    return POPULAR_MOVIES.filter((m) => favorites.includes(m.id));
  }, [favorites]);

  const featuredMovie = POPULAR_MOVIES[0]; // Interstellar

  const gridTitle = useMemo(() => {
    if (activeTab === 'films') return 'Популярные фильмы';
    if (activeTab === 'series') return 'Популярные сериалы';
    if (activeTab === 'anime') return 'Лучшие мультфильмы и аниме';
    return 'Каталог фильмов и сериалов';
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-red-600/30 selection:text-red-200">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedGenre('all');
        }}
        onSelectMovie={setSelectedMovie}
        favoritesCount={favorites.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        
        {/* Featured Hero Banner on Main Page */}
        {activeTab === 'all' && (
          <HeroBanner
            movie={featuredMovie}
            onWatch={setSelectedMovie}
            isFavorite={favorites.includes(featuredMovie.id)}
            onToggleFavorite={(m) => toggleFavorite(m)}
          />
        )}

        {/* Content Views */}
        {activeTab === 'favorites' ? (
          <FavoritesView
            favoritesMovies={favoriteMovies}
            onSelectMovie={setSelectedMovie}
            onToggleFavorite={(e, m) => toggleFavorite(e, m)}
            onClearAll={() => setFavorites([])}
          />
        ) : (
          <MovieGrid
            title={gridTitle}
            movies={movies}
            onSelectMovie={setSelectedMovie}
            favorites={favorites}
            onToggleFavorite={(e, m) => toggleFavorite(e, m)}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        )}
      </main>

      {/* Video Streaming Modal */}
      <PlayerModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isFavorite={selectedMovie ? favorites.includes(selectedMovie.id) : false}
        onToggleFavorite={(m) => toggleFavorite(m)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
