import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raghavchawla.dev'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/login', '/create-profile'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
