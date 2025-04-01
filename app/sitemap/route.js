import { NextResponse } from 'next/server'
import sitemap from '../sitemap'

export async function GET() {
  const sitemapData = await sitemap()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapData.map(entry => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified}</lastmod>
        </url>
      `).join('')}
    </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
