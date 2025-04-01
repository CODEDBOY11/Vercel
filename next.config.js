// next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/sitemap.xml',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: '' } // Remove CORS
           ],
         }
       ];
     }
   };
module.exports = {
  async headers() {
    return [{
      source: '/sitemap.xml',
      headers: [
        { key: 'Content-Type', value: 'text/xml' },
        { key: 'Cache-Control', value: 'no-store, max-age=0' }
      ]
    }]
  }
}
# Add this to next.config.js
   module.exports = {
     experimental: {
       bypassMiddlewareCache: true
     }
   }
