import { Provider } from 'next-auth/client'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { CookiesProvider } from 'react-cookie'

import * as translations from '../translations'
import * as gtag from '../lib/gtag'
import * as matomo from '../lib/matomo'

import '../styles/globals.css'
import '../styles/filter.css'
import '../styles/sticky.css'
import '../styles/accordion.css'
import '../styles/view-content.css'
import '../styles/leaflet.css'
import '../styles/loading.css'
import '../styles/tooltip.css'
import '../styles/password.css'

import CatalogContext from '../lib/CatalogContext'
import { useEffect } from 'react'
import CandidateContext from '../lib/CandidateContext'

export function reportWebVitals (metric) {
  // https://nextjs.org/docs/advanced-features/measuring-performance
  const reportWebVitals = false
  if (reportWebVitals) {
    gtag.event({
      action: metric.name,
      category: metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js metric',
      label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value)
    })
  }
}

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const { locale } = router
  const messages = { ...translations.en, ...translations[locale] }

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
      matomo.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      <Provider session={pageProps.session}>
        <CookiesProvider>
          <CatalogContext>
            <CandidateContext>
              <Component {...pageProps} />
            </CandidateContext>
          </CatalogContext>
        </CookiesProvider>
      </Provider>
    </IntlProvider>
  )
}

export default App
