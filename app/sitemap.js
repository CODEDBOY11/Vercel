export async function generateSitemap() {
   export const dynamic = 'force-dynamic'; // Bypass Vercel cache
   export const revalidate = 0; // Disable ISR
export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: 'https://vercel-sooty-alpha.vercel.app',
      lastModified: new Date().toISOString(),
    },
    {
      url: 'https://vercel-sooty-alpha.vercel.app/about',
      lastModified: new Date().toISOString(),
    },
    {
      url: 'https://vercel-sooty-alpha.vercel.app/contact',
      lastModified: new Date().toISOString(),
    },
  ];

  // Dynamic pages (e.g., movies)
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b'
    );
    const data = await response.json();
    const movies = data.results;

    const movieEntries = movies.map((movie) => ({
      url: `https://vercel-sooty-alpha.vercel.app/movie/${movie.id}`,
      lastModified: new Date().toISOString(),
    }));

    // Combine static and dynamic entries
    return [...staticPages, ...movieEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages; // Fallback to static pages if dynamic data fails
  }
}
return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${entries.map(entry => `
       <url>
         <loc>${entry.url}</loc>
         <lastmod>${entry.lastModified}</lastmod>
       </url>
       `).join('')}
     </urlset>`
   } 
