/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const { id } = useParams() as { id: string };
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_API_KEY&append_to_response=similar`
        );

        if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setMovie(data);
        setRelatedMovies(data.similar?.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Handle watchlist toggle
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

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="lGr0bhykDR3bl6ItjwSwOGLARIIIMfgl0R6ZWpAB2yM" />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">TUNEFLIX</h1>
      </header>

      {/* Movie Details */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image src={posterUrl} alt={movie?.title || 'Movie Poster'} width={300} height={450} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">{movie?.title}</h1>
            <p>{movie?.overview}</p>
            <p><strong>Rating:</strong> {movie?.vote_average.toFixed(1)}</p>
            <p><strong>Genres:</strong> {movie?.genres.map((g) => g.name).join(', ')}</p>
            <p><strong>Runtime:</strong> {movie?.runtime} mins</p>
            <p><strong>Release Date:</strong> {movie?.release_date}</p>

            {/* Watchlist Button */}
            <button onClick={handleWatchlist} className={`mt-3 px-4 py-2 rounded ${watchlist.includes(movie?.id || 0) ? 'bg-red-500' : 'bg-green-500'}`}>
              {watchlist.includes(movie?.id || 0) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>

            {/* Download Options */}
            <div className="mt-3">
              <label className="mr-2">Download Quality:</label>
              <select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)} className="bg-gray-200 p-2 rounded">
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>

            {/* Download Button */}
            <a href={`/download/${movie?.id}?quality=${selectedQuality}`} className="mt-3 inline-block bg-blue-500 px-4 py-2 rounded text-white">
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
                <Image src={`https://image.tmdb.org/t/p/w200${related.poster_path}`} alt={related.title} width={200} height={300} className="rounded-lg" />
                <p className="text-center mt-2">{related.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviePage;
