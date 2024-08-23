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
import { useCallback, useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { IntlProvider, useIntl } from 'react-intl'
import { ApolloProvider } from '@apollo/client'
import { GoogleAnalytics } from '@next/third-parties/google'
import { CookieConsentProvider } from '@use-cookie-consent/react'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import { useApollo } from '../lib/apolloClient'
import CandidateContext from '../lib/CandidateContext'
import CatalogContext from '../lib/CatalogContext'
import { ToastContextProvider } from '../lib/ToastContext'
import * as translations from '../translations'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  adjustFontFallback: false
})

const ApplicationDefaultContexts = ({ children }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [currentTenant, setCurrentTenant] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}/tenant`)
      .then(response => response.json())
      .then(({ tenant }) => setCurrentTenant(tenant))
  }, [])

  const titleForTenant = (tenantName) => {
    return tenantName !== 'dpi' ? format('app.title') : format('hub.title')
  }

  const imageForTenant = (tenantName) => {
    return tenantName !== 'dpi'
      ? 'https://exchange.dial.global/images/hero-image/exchange-hero.png'
      : 'https://exchange.dial.global/images/hero-image/hub-hero.png'
  }

  return (
    <>
      { currentTenant && (
        <CatalogContext>
          <CandidateContext>
            <ToastContextProvider>
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID} />
              <DefaultSeo
                titleTemplate={`%s - ${currentTenant} | ${titleForTenant(currentTenant)}`}
                defaultTitle={titleForTenant(currentTenant)}
                description={format('wizard.getStarted.firstLine')}
                additionalLinkTags={[{
                  rel: 'icon',
                  href: '/favicon.ico'
                }]}
                openGraph={{
                  title: titleForTenant(currentTenant),
                  type: 'website',
                  images: [
                    {
                      url: imageForTenant(currentTenant),
                      width: 700,
                      height: 380,
                      alt: `Banner of ${titleForTenant(currentTenant)}`
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
      )}
    </>
  )
}

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const { locale } = router
  const messages = { ...translations.en, ...translations[locale] }

  const client = useApollo(pageProps)

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
