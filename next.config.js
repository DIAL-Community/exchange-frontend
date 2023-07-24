const withRemoveImports = require('next-remove-imports')()
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const AnyContentSecurityPolicy = `
  frame-ancestors *;
`

const SelfContentSecurityPolicy = `
  frame-ancestors 'self';
`

module.exports = withBundleAnalyzer(withRemoveImports({
  i18n: {
    locales: ['en', 'fr', 'de', 'cs', 'es', 'pt', 'sw'],
    defaultLocale: 'en',
    localeDetection: false
  },
  images: {
    domains: [
      'localhost',
      'solutions-dev.dial.community',
      'solutions.dial.community',
      'exchange.dial.global',
      'exchange-dev.dial.global'
    ]
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
}))
