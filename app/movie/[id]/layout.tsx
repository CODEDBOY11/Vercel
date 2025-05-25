import type { Metadata } from "next";

// 1. Movie fetch function with proper typing
async function fetchMovie(id: string): Promise<{
  title: string;
  poster_path: string | null;
  overview?: string;
  genres?: Array<{ name: string }>;
}> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b`,
    { next: { revalidate: 86400 } } // Cache for 24h
  );
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);
  return res.json();
}

// 2. Enhanced metadata generator
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const movie = await fetchMovie(params.id);
    
    const ogImage = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
      : 'https://vercel-sooty-alpha.vercel.app/default-og.jpg';

    return {
      title: `${movie.title} - TUNEFLIX`,
      description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
      openGraph: {
        title: `${movie.title} - TUNEFLIX`,
        description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
        url: `https://vercel-sooty-alpha.vercel.app/movie/${params.id}`,
        type: 'website',
        images: [
          {
            url: ogImage,
            width: 1280,
            height: 720,
            alt: movie.title,
          },
        ],
        siteName: 'TUNEFLIX',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title} - TUNEFLIX`,
        description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
        images: [{ url: ogImage }],
      },
    };
  } catch (error) {
    return {
      title: 'Movie - TUNEFLIX',
      description: 'Watch this movie on TUNEFLIX',
      openGraph: {
        images: [{ url: 'https://vercel-sooty-alpha.vercel.app/default-og.jpg' }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [{ url: 'https://vercel-sooty-alpha.vercel.app/default-og.jpg' }],
      },
    };
  }
}

// 3. Layout component
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="movie-layout">{children}</div>;
}
