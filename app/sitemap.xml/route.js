import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const baseUrl = 'https://vercel-sooty-alpha.vercel.app';
    
    // 1. Always include these static URLs
    const staticUrls = [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
      { url: `${baseUrl}/contact`, lastModified: new Date() }
    ];

    // 2. Try to fetch dynamic content (but don't fail if it errors)
    let dynamicUrls = [];
    try {
      const res = await fetch(
        'https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b',
        { next: { revalidate: 86400 } } // Cache API response for 24 hours
      );
      const data = await res.json();
      dynamicUrls = (data.results || []).map(movie => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: new Date(movie.release_date || Date.now())
      }));
    } catch (apiError) {
      console.error('Movie API fetch failed, using static URLs only:', apiError);
    }

    // 3. Generate the XML
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
    console.error('Sitemap generation failed completely:', error);
    return new NextResponse('Sitemap unavailable', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
