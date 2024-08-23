const withRemoveImports = require('next-remove-imports')()
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(withRemoveImports({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }

    return config
  },
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
      'exchange-dev.dial.global',
      // Dev DPI
      'dpi.dial.community',
      // Production DPI
      'dpi.dial.global',
      'resource.dial.global',
      // Health related images
      'health.dial.community',
      // FAO related images
      'fao.dial.community'
    ]
  }
}))
