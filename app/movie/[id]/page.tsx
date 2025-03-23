"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

interface PageProps {
  params: { id: string }; // ✅ Fix: Removed Promise type
}

export default function MoviePage({ params }: PageProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!params?.id) {
      setError("Invalid movie ID.");
      return;
    }

    getMovieDetails(params.id)
      .then((data) => setMovie(data))
      .catch(() => setError("Failed to load movie details. Please try again later."));
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-2xl text-white">Loading movie details...</p>
      </div>
    );
  }

  const trailer = movie.videos?.results.find((video) => video.type === "Trailer");
  const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Hamburger Icon (Side Menu) */}
          <button onClick={() => setMenuOpen(true)} className="text-xl text-white hover:text-cyan-400 transition-colors">
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
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col">
          <button onClick={() => setMenuOpen(false)} className="text-white text-2xl absolute top-4 right-4">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <nav className="mt-16 flex flex-col space-y-6 items-center">
            <Link href="/" className="text-white text-xl hover:text-cyan-400">Home</Link>
            <Link href="/movies" className="text-white text-xl hover:text-cyan-400">Movies</Link>
            <Link href="/genres" className="text-white text-xl hover:text-cyan-400">Genres</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-32 container mx-auto px-4">
        {/* Movie Name */}
        <h2 className="text-4xl font-bold text-center mb-6">{movie.title}</h2>

        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto rounded-lg mb-6"
        />

        {/* Description */}
        <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">{movie.overview}</p>

        {/* YouTube Trailer */}
        {trailerUrl && (
          <div className="mb-6 flex justify-center">
            <iframe
              className="w-full max-w-2xl h-64 md:h-96 rounded-lg"
              src={trailerUrl}
              title="YouTube Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Download Button */}
        <button className="w-full max-w-md mx-auto bg-cyan-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-cyan-300 transition-colors mb-6 block">
          Download
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-md mt-12 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-cyan-400 mb-6">TUNEFLIX.COM</p>
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
            </div>
          </div>
          <p className="text-gray-300">&copy; {new Date().getFullYear()} TUNEFLIX. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

// ✅ Fix: Make sure `params.id` is used correctly
async function getMovieDetails(id: string) {
  try {
    const res = await fetch(`https://api.example.com/movies/${id}`);
    if (!res.ok) throw new Error("Movie not found");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
        }
