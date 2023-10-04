/** @type {import('next-sitemap').IConfig} */

const SITE_URL = 'https://exchange.dial.global'

const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: process.env.ENABLE_CRAWLERS,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: '/users' },
      { userAgent: '*', disallow: '/settings' },
      { userAgent: '*', disallow: '/sectors' },
      { userAgent: '*', disallow: '/countries' },
      { userAgent: '*', disallow: '/tags' },
      { userAgent: '*', disallow: '/candidate/*' },
      { userAgent: '*', allow: '/*' }
    ],
    additionalSitemaps: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/server-sitemap/products`,
      `${SITE_URL}/server-sitemap/organizations`,
      `${SITE_URL}/server-sitemap/workflows`,
      `${SITE_URL}/server-sitemap/sdgs`,
      `${SITE_URL}/server-sitemap/building-blocks`,
      `${SITE_URL}/server-sitemap/use-cases`,
      `${SITE_URL}/server-sitemap/projects`,
      `${SITE_URL}/server-sitemap/playbooks`
    ]
  },
  exclude: [
    '/users',
    '/settings',
    '/sectors',
    '/countries',
    '/tags',
    '/candidate/*',
    '/sitemap.xml',
    '/server-sitemap/*'
  ]
}

module.exports = config
