const AnyContentSecurityPolicy = `
  frame-ancestors *;
`

const SelfContentSecurityPolicy = `
  frame-ancestors 'self';
`

module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de', 'cs', 'es', 'pt', 'sw'],
    defaultLocale: 'en',
    localeDetection: false
  },
  images: {
    loader: 'default',
    domains: ['strapi.dial.community', 'localhost'],
  },
  async headers() {
    return [
      {
        source: '/playbooks/:slug/embedded',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: AnyContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      },
      {
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: SelfContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}
