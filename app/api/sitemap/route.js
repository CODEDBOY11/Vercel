import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = '04553a35f2a43bffba8c0dedd36ac92b'; // TMDb API key

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );

    if (!res.ok) throw new Error('Failed to fetch TMDb data');

    const data = await res.json();
    const movies = data.results || [];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vercel-sooty-alpha.vercel.app/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  ${movies
    .map(
      (movie) => `
  <url>
    <loc>https://vercel-sooty-alpha.vercel.app/movie/${movie.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}
