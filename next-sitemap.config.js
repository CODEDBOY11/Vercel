module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app', // Replace with your domain
  generateRobotsTxt: true, // Generate robots.txt file
  additionalPaths: async () => {
    // Fetch dynamic paths (e.g., movies)
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=04553a35f2a43bffba8c0dedd36ac92b'
    );
    const data = await response.json();
    const movies = data.results;

    return movies.map((movie) => ({
      loc: `https://vercel-sooty-alpha.vercel.app/movie/${movie.id}`,
      lastmod: new Date().toISOString(),
    }));
  },
};
