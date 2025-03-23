module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app', // Your site URL
  generateRobotsTxt: true, // Generate robots.txt
  exclude: ['/sitemap'], // Exclude the API sitemap from static generation
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all bots
        allow: '/', // Allow crawling all pages
      },
    ],
    additionalSitemaps: [
      'https://vercel-sooty-alpha.vercel.app/sitemap', // Only keep your API-based sitemap
    ],
  },
  generateIndexSitemap: false, // Prevents `sitemap.xml` from being created
};
