import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Static URLs
  const staticUrls = [
    {
      url: 'https://vercel-sooty-alpha.vercel.app',
      lastModified: new Date().toISOString(),
    },
    {
      url: 'https://vercel-sooty-alpha.vercel.app/about',
      lastModified: new Date().toISOString(),
    }
  ];

  // 2. Dynamic URLs (from API)
  let dynamicUrls = [];
  try {
    const res = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b');
    const movies = await res.json();
    dynamicUrls = movies.results.map(movie => ({
      url: `https://vercel-sooty-alpha.vercel.app/movie/${movie.id}`,
      lastModified: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }

  // 3. Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticUrls, ...dynamicUrls].map(entry => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified}</lastmod>
        </url>
      `).join('')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
