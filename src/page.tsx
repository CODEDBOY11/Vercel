"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch results from the deployed backend
  const fetchResults = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://media-downloader-backend-sqrr.vercel.app/api/search?q=${searchQuery}&page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();
      if (page === 1) {
        setResults(data.results || []);
      } else {
        setResults((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch suggestions dynamically
  const fetchSuggestions = debounce(async () => {
    if (searchQuery.length > 2) {
      try {
        const response = await fetch(
          `https://media-downloader-backend-sqrr.vercel.app/api/search?q=${searchQuery}`
        );
        const data = await response.json();
        setSuggestions(data.results.slice(0, 3)); // Limit to 3 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchSuggestions();
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    setPage(1);
    fetchResults(1);
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Apply dark mode on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-900`}>
      <Head>
        <title>Media Downloader - Search Movies and Music</title>
        <meta name="description" content="Search, download, and explore movies and music with ease." />
        <meta name="keywords" content="movies, music, downloader, search" />
        <meta property="og:title" content="Media Downloader - Search Movies and Music" />
        <meta property="og:description" content="Search, download, and explore movies and music with ease." />
        <meta property="og:image" content="/images/thumbnail.jpg" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Media Downloader
        </h1>
        {/* Dark Mode Toggle */}
        <div
          className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer ${
            darkMode ? "bg-gray-700" : "bg-yellow-400"
          }`}
          onClick={toggleDarkMode}
        >
          <div
            className={`absolute left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform ${
              darkMode ? "translate-x-0" : "translate-x-6"
            }`}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Search Bar */}
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for movies, music, or media..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleSearchSubmit}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-60 overflow-y-scroll">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.title);
                    handleSearchSubmit();
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <p className="text-gray-800 dark:text-gray-200">{item.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8">
          {isLoading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {results.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <li key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
                      {item.title || "No Title"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {item.description || "No Description"}
                    </p>
                    <Link href={`/movie/${item.id}`}>
                      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Download
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLoadMore}
                className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </>
          ) : (
            !isLoading && <p className="text-center text-gray-600 dark:text-gray-400">No results found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
