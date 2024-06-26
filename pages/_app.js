import 'react-datepicker/dist/react-datepicker.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css'
import 'handsontable/dist/handsontable.full.css'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'react-comments-section/dist/index.css'
import 'react-responsive-modal/styles.css'
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
import '../styles/prismjs-highlight.css'
import '../styles/swagger-ui.css'
import '../styles/overrides.css'
import '../styles/ui/v1/ribbon.css'
import '../styles/ui/v1/swiper.css'
import '../styles/ui/v1/comment.scss'
import '../styles/ui/v1/wizard.scss'
import '../styles/ui/v1/parser.scss'
import { useCallback, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { IntlProvider, useIntl } from 'react-intl'
import { ApolloProvider } from '@apollo/client'
import { CookieConsentProvider } from '@use-cookie-consent/react'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import { useApollo } from '../lib/apolloClient'
import CandidateContext from '../lib/CandidateContext'
import CatalogContext from '../lib/CatalogContext'
import * as gtag from '../lib/gtag'
import { ToastContextProvider } from '../lib/ToastContext'
import * as translations from '../translations'

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

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  adjustFontFallback: false
})

const ApplicationDefaultContexts = ({ children }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <CatalogContext>
      <CandidateContext>
        <ToastContextProvider>
          <DefaultSeo
            titleTemplate={`%s | ${format('app.title')}`}
            defaultTitle={format('app.title')}
            description={format('wizard.getStarted.firstLine')}
            additionalLinkTags={[{
              rel: 'icon',
              href: '/favicon.ico'
            }]}
            openGraph={{
              title: format('app.title'),
              type: 'website',
              images: [
                {
                  url: 'https://exchange.dial.global/images/hero-image/exchange-hero.png',
                  width: 700,
                  height: 380,
                  alt: 'Banner of Digital Impact Exchange'
                }
              ]
            }}
            twitter={{
              cardType: 'summary_large_image'
            }}
          />
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

  const client = useApollo(pageProps)

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <main className={poppins.className}>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
        />
      </Head>
      <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
        <ApolloProvider client={client}>
          <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
            <CookieConsentProvider>
              <DndProvider backend={HTML5Backend}>
                <ApplicationDefaultContexts>
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </ApplicationDefaultContexts>
              </DndProvider>
            </CookieConsentProvider>
          </SessionProvider>
        </ApolloProvider>
      </IntlProvider>
    </main>
  )
}

export default App
