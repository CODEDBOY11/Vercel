"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import Link from 'next/link';

async function getMovieDetails(id: string) {
  const apiKey = '04553a35f2a43bffba8c0dedd36ac92b';
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return res.json();
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);

  // Extract YouTube trailer key
  const trailer = movie.videos?.results?.find((video: any) => video.type === 'Trailer');
  const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Hamburger Icon (Top-Left) */}
          <button
            className="text-xl text-white hover:text-cyan-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>

          {/* TUNEFLIX Logo (Center) */}
          <h1 className="text-2xl font-bold text-cyan-400">TUNEFLIX</h1>

          {/* Search Icon (Top-Right) */}
          <Link href="https://vercel-sooty-alpha.vercel.app/" legacyBehavior>
            <a className="text-xl text-white hover:text-cyan-400 transition-colors">
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </a>
          </Link>
        </div>

        {/* Genre Navigation */}
        <div className="overflow-x-auto whitespace-nowrap py-2 border-t border-gray-800">
          <div className="container mx-auto px-4 flex gap-4">
            {movie.genres.map((genre: any) => (
              <button
                key={genre.id}
                className="px-4 py-2 bg-cyan-400 text-gray-900 font-bold rounded-full transition-colors hover:bg-cyan-300 hover:scale-105"
              >
                {genre.name}
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
          onClick={() => setIsMenuOpen(false)}
        ></div>
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
        <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">
          {movie.overview}
        </p>

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

        {/* Like and Comment Buttons */}
        <div className="flex gap-4 mb-12 justify-center">
          <button className="px-6 py-2 bg-cyan-400 text-gray-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors">
            Like
          </button>
          <button className="px-6 py-2 bg-cyan-400 text-gray-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors">
            Comment
          </button>
        </div>

        {/* Explore Other Genres */}
        <h3 className="text-2xl font-bold text-center mb-6">Explore Other Genres</h3>
        <div className="overflow-x-auto whitespace-nowrap pb-6">
          <div className="flex gap-4">
            {movie.genres.map((genre: any) => (
              <div key={genre.id} className="inline-block">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={`${genre.name} Movie`}
                  className="w-48 h-64 rounded-lg"
                />
                <p className="mt-2 text-center text-sm font-bold">{genre.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
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
