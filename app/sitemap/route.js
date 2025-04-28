import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://vercel-sooty-alpha.vercel.app';
  
  try {
    // 1. Static URLs (always work)
    const staticUrls = [
      { url: baseUrl, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/about`, lastModified: new Date().toISOString() }
    ];

    // 2. Dynamic URLs (fail gracefully)
    let dynamicUrls = [];
    try {
      const apiRes = await fetch(
        'https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b',
        { next: { revalidate: 3600 } } // Cache API for 1 hour
      );
      
      if (apiRes.ok) {
        const data = await apiRes.json();
        dynamicUrls = (data.results || []).map((movie: any) => ({
          url: `${baseUrl}/movie/${movie.id}`,
          lastModified: new Date(movie.release_date || Date.now()).toISOString()
        }));
      }
    } catch (apiError) {
      console.error('API fetch failed - using static URLs only:', apiError);
    }

    // 3. Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${[...staticUrls, ...dynamicUrls].map(entry => `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${entry.lastModified}</lastmod>
          </url>
        `).join('')}
      </urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Sitemap generation crashed:', error);
    return new NextResponse('Sitemap unavailable', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
