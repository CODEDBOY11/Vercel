"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b&append_to_response=videos,credits,similar`);
        if (!response.ok) throw new Error("Failed to fetch movie data");
        const data = await response.json();
        setMovie(data);
        setRelatedMovies(data.similar.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Dark mode toggle
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", !darkMode);
  };

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!movie) return <p className="text-center text-gray-600">Movie not found.</p>;

  const trailer = movie.videos?.results.find((vid) => vid.type === "Trailer");
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-900`}>
      <Head>
        <title>{movie.title} - Movie Details</title>
        <meta name="description" content={movie.overview} />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Movie Details</h1>
        <div className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer ${darkMode ? "bg-gray-700" : "bg-yellow-400"}`} onClick={toggleDarkMode}>
          <div className={`absolute left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${darkMode ? "translate-x-0" : "translate-x-6"}`}>
            {darkMode ? "🌙" : "☀️"}
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <Image src={posterUrl} width={500} height={750} alt={movie.title} className="rounded-lg shadow-lg" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{movie.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{movie.overview}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Release Date:</strong> {movie.release_date}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Rating:</strong> ⭐ {movie.vote_average}/10</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>

            {/* Download Options */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Download</h3>
              <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Download 1080p</button>
              <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Download 720p</button>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Watch Trailer</h3>
            <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen className="rounded-lg shadow-lg"></iframe>
          </div>
        )}

        {/* Related Movies */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Related Movies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {relatedMovies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
                <div className="cursor-pointer p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Image src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} width={200} height={300} alt={movie.title} className="rounded-md" />
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">{movie.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media Sharing */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Share</h3>
          <div className="flex space-x-4 mt-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" className="text-blue-600">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank" className="text-blue-400">Twitter</a>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`} target="_blank" className="text-green-500">WhatsApp</a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/">
            <button className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">Back to Home</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
