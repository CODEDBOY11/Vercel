import type { ReactNode } from "react";
import type { Metadata } from "next";

// Movie fetch function
async function fetchMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);
  return res.json();
}

// Metadata generator
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await fetchMovie(id);

    // Always use the movie poster if available (high-quality)
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
      : "https://vercel-sooty-alpha.vercel.app/default-og.jpg"; // Fallback

    return {
      title: `${movie.title} - TUNEFLIX`,
      description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
      openGraph: {
        title: `${movie.title} - TUNEFLIX`,
        description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
        url: `https://vercel-sooty-alpha.vercel.app/movie/${id}`,
        type: "website",
        images: [
          {
            url: posterUrl,
            width: 1280,
            height: 720,
            alt: movie.title,
          },
        ],
        siteName: "TUNEFLIX",
      },
      twitter: {
        card: "summary_large_image",
        title: `${movie.title} - TUNEFLIX`,
        description: movie.overview?.slice(0, 160) || "Watch on TUNEFLIX",
        images: [{ url: posterUrl }],
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    return {
      title: "Movie - TUNEFLIX",
      description: "Watch this movie on TUNEFLIX",
      openGraph: {
        images: [
          {
            url: "https://vercel-sooty-alpha.vercel.app/default-og.jpg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: [
          {
            url: "https://vercel-sooty-alpha.vercel.app/default-og.jpg",
          },
        ],
      },
    };
  }
}

// Layout component (unchanged)
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div className="movie-layout">{children}</div>;
}
