module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app',
  generateRobotsTxt: true, // Generate robots.txt
  exclude: ['/sitemap'], // Exclude the API-based sitemap from static generation
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://vercel-sooty-alpha.vercel.app/sitemap', // Only include the API-based sitemap
    ],
  },
  generateIndexSitemap: false, // Disable the index sitemap completely
  autoLastmod: false, // Prevent lastmod updates from interfering
  changefreq: null, // Prevent frequency settings from auto-generating XML
  sitemapSize: 100000, // Prevent multiple sitemaps from being created
};
