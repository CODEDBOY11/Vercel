module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app', // Your Vercel URL
  generateRobotsTxt: true, // Generate robots.txt
  exclude: ['/sitemap'], // Exclude API-based sitemap from static generation
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all bots
        allow: '/', // Allow crawling of all pages
      },
    ],
    additionalSitemaps: [
      'https://vercel-sooty-alpha.vercel.app/sitemap', // Keep only your API-based sitemap
    ],
  },
  generateIndexSitemap: false, // Prevents `/sitemap.xml` from being created
  sitemapSize: 50000, // Just in case, prevent splitting into multiple files
};
