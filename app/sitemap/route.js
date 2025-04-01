import { NextResponse } from 'next/server'
   import { generateSitemap } from '../sitemap' // Your existing sitemap generator

   export async function GET() {
     const sitemap = await generateSitemap()
     return new NextResponse(sitemap, {
       headers: {
         'Content-Type': 'text/xml',
         'Cache-Control': 'no-store, max-age=0'
       }
     })
   }
