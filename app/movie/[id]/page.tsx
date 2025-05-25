"use client"; // Mark this component as a Client Component

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Head from 'next/head'; // Import Head for SEO

// Define the Movie type based on TMDb API response
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres: { id: number; name: string }[];
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

// Define the GenreMovie type for popular movies in each genre
interface GenreMovie {
  id: number;
  title: string;
  poster_path: string;
}

// Movie Details Page Component
export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<{ [key: string]: GenreMovie[] }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams(); // Get the ID from the URL
  const { id } = params;

  // Fetch movie data based on ID (with non-expiring caching)
  useEffect(() => {
    const fetchMovie = async () => {
      const cacheKey = `movie-${id}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        // Use cached data if available
        setMovie(JSON.parse(cachedData));
        return;
      }

      try {
        // Fetch movie details from API
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b&append_to_response=videos`
        );
        const data: Movie = await movieRes.json();

        // Cache the fetched data indefinitely
        localStorage.setItem(cacheKey, JSON.stringify(data));

        setMovie(data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch popular movies for each genre (with non-expiring caching)
  useEffect(() => {
    const fetchPopularMovies = async () => {
      const cacheKey = 'popular-movies';
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        // Use cached data if available
        setPopularMovies(JSON.parse(cachedData));
        return;
      }

      const genres = ['Action', 'Drama', 'Comedy', 'Thriller'];
      const popularMoviesByGenre: { [key: string]: GenreMovie[] } = {};

      for (const genre of genres) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=04553a35f2a43bffba8c0dedd36ac92b&with_genres=${getGenreId(
              genre
            )}&sort_by=popularity.desc&page=1`
          );
          const data = await res.json();
          popularMoviesByGenre[genre] = data.results.slice(0, 4); // Get top 4 movies for each genre
        } catch (error) {
          console.error(`Failed to fetch ${genre} movies:`, error);
        }
      }

      // Cache the fetched data indefinitely
      localStorage.setItem(cacheKey, JSON.stringify(popularMoviesByGenre));

      setPopularMovies(popularMoviesByGenre);
    };

    fetchPopularMovies();
  }, []);

  // Helper function to get genre ID from genre name
  const getGenreId = (genre: string) => {
    switch (genre) {
      case 'Action':
        return 28;
      case 'Drama':
        return 18;
      case 'Comedy':
        return 35;
      case 'Thriller':
        return 53;
      default:
        return 28; // Default to Action
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!movie) {
    return <div className="text-center py-8">Loading...</div>; // Show a loading state while fetching data
  }

  // Get the first trailer video (if available)
  const trailer = movie.videos?.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  return (
    <>
     <Head>
  <title>{`${movie.title} - TUNEFLIX`}</title>
  <meta
    name="description"
    content={`Watch ${movie.title} on TUNEFLIX. ${movie.overview.slice(0, 160)}`}
  />
  <meta
    name="keywords"
    content={`${movie.title}, ${movie.genres.map((genre) => genre.name).join(', ')}, download ${movie.title}, watch ${movie.title}`}
  />
  <meta property="og:title" content={`${movie.title} - TUNEFLIX`} />
  <meta
    property="og:description"
    content={`Watch ${movie.title} on TUNEFLIX. ${movie.overview.slice(0, 160)}`}
  />
  <meta property="og:image" content={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`} />
  <meta property="og:url" content={`https://vercel-sooty-alpha.vercel.app/movie/${id}`} />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Movie",
      name: movie.title,
      image: `https://image.tmdb.org/t/p/w1280${movie.poster_path}`,
      description: movie.overview,
      genre: movie.genres.map((genre) => genre.name),
      url: `https://vercel-sooty-alpha.vercel.app/movie/${id}`,
    })}
  </script>
</Head>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Hamburger Icon */}
          <button
            className="text-xl text-white hover:text-cyan-400 transition-colors"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>

          {/* TUNEFLIX Logo */}
          <h1 className="text-2xl font-bold text-cyan-400">TUNEFLIX</h1>

          {/* Search Icon */}
          <Link href="https://vercel-sooty-alpha.vercel.app/" legacyBehavior>
            <a className="text-xl text-white hover:text-cyan-400 transition-colors">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </a>
          </Link>
        </div>

        {/* Genre Navigation (Reverted to Static Genres) */}
        <div className="overflow-x-auto whitespace-nowrap py-2 border-t border-gray-800">
          <div className="container mx-auto px-4 flex gap-4">
            {['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi'].map((genre, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-cyan-400 text-gray-900 font-bold rounded-full transition-colors hover:bg-cyan-300 hover:scale-105"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-md z-50 w-64 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">Menu</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/" legacyBehavior>
                <a className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/movies" legacyBehavior>
                <a className="text-gray-300 hover:text-cyan-400 transition-colors">Movies</a>
              </Link>
            </li>
            <li>
              <Link href="/music" legacyBehavior>
                <a className="text-gray-300 hover:text-cyan-400 transition-colors">Music</a>
              </Link>
            </li>
            <li>
              <Link href="/news" legacyBehavior>
                <a className="text-gray-300 hover:text-cyan-400 transition-colors">News</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-40 container mx-auto px-4"> {/* Added space between header and movie name */}
        {/* Movie Name */}
        <h1 className="text-4xl font-bold text-center mb-6">{movie.title}</h1>

        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
          alt={`${movie.title} Poster`}
          className="w-full h-auto rounded-lg mb-6"
        />

        {/* Description */}
        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
          {movie.overview}
        </p>

        {/* YouTube Trailer */}
        {trailer && (
          <div className="mb-6 flex justify-center">
            <iframe
              className="w-full max-w-2xl h-64 md:h-96 rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Download Button */}
        <button className="w-full max-w-md mx-auto bg-cyan-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-cyan-300 transition-colors mb-6 block">
          Download
        </button>

        {/* Comment Button with Link */}
        <div className="flex justify-center mb-12">
          <a
            href="https://next-xi-opal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-cyan-400 text-gray-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors"
          >
            Comment
          </a>
        </div>

        {/* Explore Other Genres (Updated with Popular Movies) */}
        <h2 className="text-2xl font-bold text-center mb-6">Explore Other Genres</h2>
        <div className="space-y-8">
          {Object.entries(popularMovies).map(([genre, movies]) => (
            <div key={genre}>
              <h3 className="text-xl font-bold mb-4">{genre}</h3>
              <div className="overflow-x-auto whitespace-nowrap pb-4">
                <div className="flex gap-4">
                  {movies.map((movie) => (
                    <div key={movie.id} className="flex-shrink-0">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={`${movie.title} Poster`}
                        className="w-48 h-64 rounded-lg object-cover"
                      />
                      <p className="mt-2 text-center text-sm font-bold">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer (Reverted to Original) */}
      <footer className="bg-gray-900/90 backdrop-blur-md mt-12 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          {/* TUNEFLIX.COM */}
          <p className="text-2xl font-bold text-cyan-400 mb-6">TUNEFLIX.COM</p>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                Email: tuneflix@gmail.com
              </p>
              <p className="text-gray-300 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                Phone: +234 912 140 8611
              </p>
              <p className="text-gray-300 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                Phone: +234 901 063 1071
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors">Movies</a>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors">Music</a>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors">News</a>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faFacebook} className="w-4 h-4" />
                Facebook
              </a>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
                Twitter
              </a>
              <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="text-center border-t border-gray-800 pt-6">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} TUNEFLIX. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors mx-2">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors mx-2">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
