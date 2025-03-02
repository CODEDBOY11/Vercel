'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  release_date: string;
}

interface Review {
  id: number;
  author: string;
  content: string;
  rating?: number;
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b&append_to_response=similar`
        );
        const data = await res.json();

        setMovie(data);
        setRelatedMovies(data.similar.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Handle watchlist
  const handleWatchlist = () => {
    if (movie) {
      setWatchlist((prev) =>
        prev.includes(movie.id) ? prev.filter((m) => m !== movie.id) : [...prev, movie.id]
      );
    }
  };

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.trim() === '') return;

    const newReviewObj: Review = {
      id: Date.now(),
      author: `Anonymous${reviews.length}`,
      content: newReview,
      rating: newRating || undefined,
    };

    setReviews((prevReviews) => [newReviewObj, ...prevReviews]);
    setNewReview('');
    setNewRating(null);
  };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // SEO Metadata
  const seoTitle = `${movie?.title} - Watch, Download & Reviews | TUNEFLIX`;
  const seoDescription = movie?.overview || 'Discover movie details, reviews, and download options on TUNEFLIX';
  const canonicalUrl = `https://yourdomain.com/movie/${id}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie?.poster_path}`;

  // Structured Data for Google
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie?.title,
    image: posterUrl,
    description: movie?.overview,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie?.vote_average,
      bestRating: '10',
      worstRating: '0',
      ratingCount: '1000', // Replace with actual count if available
    },
    genre: movie?.genres.map((g) => g.name).join(', '),
    datePublished: movie?.release_date,
    duration: movie?.runtime ? `PT${movie.runtime}M` : undefined,
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={posterUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        <meta property="twitter:image" content={posterUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>

      {/* Header with Dark Mode Toggle */}
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">TUNEFLIX</h1>
          <Link href="https://vercel-rho-silk-31.vercel.app/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
        </div>
        <div
          className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer ${
            isDarkMode ? 'bg-gray-700' : 'bg-yellow-400'
          }`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <div
            className={`absolute left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform ${
              isDarkMode ? 'translate-x-0' : 'translate-x-6'
            }`}
          >
            {isDarkMode ? (
              <svg
                className="w-4 h-4 text-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            )}
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={posterUrl}
            alt={movie?.title || 'Movie Poster'}
            width={300}
            height={450}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{movie?.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{movie?.overview}</p>
            <p className="mt-2">
              <strong>Rating:</strong> {movie?.vote_average.toFixed(1)}
            </p>
            <p>
              <strong>Genres:</strong> {movie?.genres.map((g) => g.name).join(', ')}
            </p>
            <p>
              <strong>Runtime:</strong> {movie?.runtime} mins
            </p>
            <p>
              <strong>Release Date:</strong> {movie?.release_date}
            </p>

            {/* Watchlist Button */}
            <button
              onClick={handleWatchlist}
              className={`mt-3 px-4 py-2 rounded ${
                watchlist.includes(movie?.id || 0) ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {watchlist.includes(movie?.id || 0) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>

            {/* Download Options */}
            <div className="mt-3">
              <label className="mr-2">Download Quality:</label>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>

            {/* Download Button */}
            <a
              href={`/download/${movie?.id}?quality=${selectedQuality}`}
              className="mt-3 inline-block bg-blue-500 px-4 py-2 rounded text-white"
            >
              Download {selectedQuality}
            </a>
          </div>
        </div>

        {/* Related Movies */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Related Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {relatedMovies.map((related) => (
              <Link key={related.id} href={`/movie/${related.id}`} className="block">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${related.poster_path}`}
                  alt={related.title}
                  width={200}
                  height={300}
                  className="rounded-lg"
                />
                <p className="text-center mt-2">{related.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* User Reviews */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold">User Reviews</h2>
          <form onSubmit={handleReviewSubmit} className="mt-3">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write a review..."
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            />
            <button type="submit" className="mt-3 bg-green-500 px-4 py-2 rounded">
              Submit Review
            </button>
          </form>

          {/* Display Reviews */}
          <div className="mt-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border p-3 rounded my-2">
                  <p className="font-semibold">{review.author}</p>
                  <p className={`${expandedReviews[review.id] ? '' : 'line-clamp-3'}`}>
                    {review.content}
                  </p>
                  {review.content.length > 100 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="text-blue-500 mt-2"
                    >
                      {expandedReviews[review.id] ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to write one!</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 p-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-bold">About Us</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                TUNEFLIX is your go-to platform for discovering and downloading movies and music.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Email: support@tuneflix.com<br />
                Phone: +1 (123) 456-7890
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Privacy Policy</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Read our{' '}
                <Link href="/privacy-policy" className="text-blue-500 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()} TUNEFLIX. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default MoviePage;
