module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app', // Your site URL
  generateRobotsTxt: true, // Generate robots.txt
  exclude: ['/api/sitemap'], // Exclude the API route from static sitemap
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all bots
        allow: '/', // Allow crawling all pages
      },
    ],
    additionalSitemaps: [
      'https://vercel-sooty-alpha.vercel.app/sitemap', // Use the custom API sitemap
    ],
  },
  generateIndexSitemap: false, // Prevents generating `sitemap.xml`
};
