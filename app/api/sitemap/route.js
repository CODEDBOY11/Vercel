// app/api/sitemap/route.js
import { getServerSideSitemap } from 'next-sitemap';

export async function GET() {
  try {
    // Fetch popular movies from TMDb API
    const apiKey = '04553a35f2a43bffba8c0dedd36ac92b'; // Replace with your TMDb API key
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await res.json();
    const movies = data.results;

    // Generate sitemap entries for each movie
    const fields = movies.map((movie) => ({
      loc: `https://vercel-sooty-alpha.vercel.app/movie/${movie.id}`, // Dynamic URL for each movie
      lastmod: new Date().toISOString(), // Last modified date
      changefreq: 'daily', // How often the page changes
      priority: 0.7, // Priority of the page (0.0 to 1.0)
    }));

    // Return the sitemap
    return getServerSideSitemap(fields);
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}
