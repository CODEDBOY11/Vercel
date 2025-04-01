import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Bypass cache

export async function GET() {
  try {
    // 1. Static URLs
    const staticUrls = [
      {
        url: 'https://vercel-sooty-alpha.vercel.app',
        lastModified: new Date(),
      },
      {
        url: 'https://vercel-sooty-alpha.vercel.app/about',
        lastModified: new Date(),
      }
    ];

    // 2. Dynamic URLs (from API)
    const apiResponse = await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b',
      { next: { revalidate: 86400 } } // Cache API for 24h
    );
    const movies = await apiResponse.json();
    
    const dynamicUrls = movies.results.map(movie => ({
      url: `https://vercel-sooty-alpha.vercel.app/movie/${movie.id}`,
      lastModified: new Date(),
    }));

    // 3. Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${[...staticUrls, ...dynamicUrls].map(entry => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastModified.toISOString()}</lastmod>
          </url>
        `).join('')}
      </urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });

  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return new NextResponse('Sitemap unavailable', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
