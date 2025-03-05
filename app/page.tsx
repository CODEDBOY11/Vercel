"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

interface ResultItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

// Caching interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache key generator (unique for each query/page)
const generateCacheKey = (query: string, page: number) => `${query}-${page}`;

// Save to cache
const saveToCache = <T,>(key: string, data: T) => {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
};

// Retrieve from cache (with 2-day TTL)
const getFromCache = <T,>(key: string, ttl: number = 172800000): T | null => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const parsedCache: CacheItem<T> = JSON.parse(cachedData);
  const isStale = Date.now() - parsedCache.timestamp > ttl;

  return isStale ? null : parsedCache.data;
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [suggestions, setSuggestions] = useState<ResultItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Debounce function to limit API calls
  const debounce = useCallback(
    <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  // Utility function to handle errors
  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("An unknown error occurred");
    }
  };

  // Fetch results from the deployed backend
  const fetchResults = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    // Generate cache key
    const cacheKey = generateCacheKey(searchQuery, page);

    // Check cache first
    const cachedResults = getFromCache<ResultItem[]>(cacheKey);
    if (cachedResults) {
      setResults((prev) =>
        page === 1 ? cachedResults : [...prev, ...cachedResults]
      );
      setIsLoading(false);
      return;
    }

    // If no cache, fetch from API
    try {
      const response = await fetch(
        `https://media-downloader-backend-sqrr.vercel.app/api/search?q=${searchQuery}&page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();

      // Update state
      setResults((prev) =>
        page === 1 ? data.results || [] : [...prev, ...(data.results || [])]
      );

      // Save to cache (2-day TTL)
      saveToCache(cacheKey, data.results || []);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch suggestions dynamically
  const fetchSuggestions = useCallback(
    debounce(async () => {
      if (searchQuery.length > 2) {
        // Check cache first
        const cacheKey = `suggestions-${searchQuery}`;
        const cachedSuggestions = getFromCache<ResultItem[]>(cacheKey);
        if (cachedSuggestions) {
          setSuggestions(cachedSuggestions);
          return;
        }

        try {
          const response = await fetch(
            `https://media-downloader-backend-sqrr.vercel.app/api/search?q=${searchQuery}`
          );
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
          const sliced = data.results.slice(0, 3);

          setSuggestions(sliced);
          saveToCache(cacheKey, sliced); // Cache for 2 days
        } catch (error) {
          handleError(error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    [searchQuery]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchSuggestions();
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    setPage(1);
    setResults([]);
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
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
      }
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-900`}>
        <Head>
  <title>Media Downloader - Search Movies and Music</title>
  <meta name="description" content="Search, download, and explore movies and music with ease." />
  <meta name="keywords" content="movies, music, downloader, search" />
  
  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Media Downloader - Search Movies and Music" />
  <meta property="og:description" content="Search, download, and explore movies and music with ease." />
  <meta property="og:image" content="https://vercel-sooty-alpha.vercel.app/images/thumbnail.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://vercel-sooty-alpha.vercel.app/" />
  <meta name="robots" content="index, follow" />
  
  {/* Google Verification Tag */}
  <meta name="google-site-verification" content="lGr0bhykDR3bl6ItjwSwOGLARIIIMfgl0R6ZWpAB2yM" />
</Head>
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Media Downloader</h1>
        <div
          className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer ${
            darkMode ? "bg-gray-700" : "bg-yellow-400"
          }`}
          onClick={toggleDarkMode}
          role="button"
          aria-label="Toggle dark mode"
        >
          <div
            className={`absolute left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform ${
              darkMode ? "translate-x-0" : "translate-x-6"
            }`}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.636 6.636l-1.414-1.414m12.728 12.728l-1.414-1.414M6.636 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            )}
          </div>
        </div>
      </header>

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
            aria-label="Search"
          >
            Search
          </button>

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
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <p className="text-gray-800 dark:text-gray-200">{item.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          {isLoading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {results.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <li key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      width={400}
                      height={300}
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
