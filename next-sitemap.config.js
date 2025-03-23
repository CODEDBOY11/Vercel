// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://vercel-sooty-alpha.vercel.app', // Replace with your Vercel URL
  generateRobotsTxt: true, // Generate robots.txt file
  exclude: [], // Exclude the custom API route
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all bots to crawl your site
        allow: '/', // Allow crawling of all pages
      },
    ],
    additionalSitemaps: [
      'https://vercel-sooty-alpha.vercel.app/api/sitemap', // Add the custom API route
    ],
  },
};
