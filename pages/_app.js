
import { useEffect } from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'next-auth/client'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import * as translations from '../translations'
import * as gtag from '../lib/gtag'
import * as matomo from '../lib/matomo'
import '../styles/globals.css'
import '../styles/editor.css'
import '../styles/filter.css'
import '../styles/sticky.css'
import '../styles/accordion.css'
import '../styles/view-content.css'
import '../styles/leaflet.css'
import '../styles/loading.css'
import '../styles/tooltip.css'
import '../styles/password.css'
import '../styles/drawer.css'
import '../styles/card.css'
import '../styles/playbook.css'
import '../styles/infinite.css'
import 'react-toastify/dist/ReactToastify.css'
import CatalogContext from '../lib/CatalogContext'
import CandidateContext from '../lib/CandidateContext'
import { ToastContextProvider } from '../lib/ToastContext'
import client from '../lib/apolloClient'

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

const ApplicationDefaultContexts = ({ children }) => {
  return (
    <CatalogContext>
      <CandidateContext>
        <ToastContextProvider>
          {children}
        </ToastContextProvider>
      </CandidateContext>
    </CatalogContext>
  )
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
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0' />
      </Head>
      <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
        <ApolloProvider client={client}>
          <Provider session={pageProps.session}>
            <DndProvider backend={HTML5Backend}>
              <ApplicationDefaultContexts>
                <Component {...pageProps} />
              </ApplicationDefaultContexts>
            </DndProvider>
          </Provider>
        </ApolloProvider>
      </IntlProvider>
    </>
  )
}

export default App
