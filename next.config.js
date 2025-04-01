module.exports = {
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'text/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ]
      }
    ];
  }
};
