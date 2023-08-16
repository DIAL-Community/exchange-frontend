const withRemoveImports = require('next-remove-imports')()
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(withRemoveImports({
  i18n: {
    locales: ['en', 'fr', 'de', 'cs', 'es', 'pt', 'sw'],
    defaultLocale: 'en',
    localeDetection: false
  },
  experimental: {
    appDir: false
  },
  images: {
    domains: [
      'localhost',
      'solutions-dev.dial.community',
      'solutions.dial.community',
      'exchange.dial.global',
      'exchange-dev.dial.global'
    ]
  }
}))
