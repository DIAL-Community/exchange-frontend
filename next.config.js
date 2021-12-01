const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? 'https://cdn.solutions.dial.community' : '',
  i18n: {
    locales: ['en', 'fr', 'de', 'cs'],
    defaultLocale: 'en',
    localeDetection: false
  }
}
