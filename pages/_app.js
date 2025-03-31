import 'handsontable/dist/handsontable.full.css'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'react-comments-section/dist/index.css'
import 'react-responsive-modal/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-grid-layout/css/styles.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '../styles/accordion.css'
import '../styles/card.css'
import '../styles/drawer.css'
import '../styles/editor.css'
import '../styles/filter.css'
import '../styles/globals.css'
import '../styles/infinite.css'
import '../styles/leaflet.css'
import '../styles/loading.css'
import '../styles/overrides.css'
import '../styles/password.css'
import '../styles/playbook.css'
import '../styles/prismjs-highlight.css'
import '../styles/sticky.css'
import '../styles/swagger-ui.css'
import '../styles/tooltip.css'
import '../styles/ui/v1/comment.scss'
import '../styles/ui/v1/parser.scss'
import '../styles/ui/v1/ribbon.css'
import '../styles/ui/v1/swiper.css'
import '../styles/ui/v1/wizard.scss'
import '../styles/view-content.css'
import '../styles/lexical.scss'
import { useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { IntlProvider } from 'react-intl'
import { ApolloProvider } from '@apollo/client'
import { GoogleAnalytics } from '@next/third-parties/google'
import { CookieConsentProvider } from '@use-cookie-consent/react'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import { useApollo } from '../lib/apolloClient'
import CatalogContext from '../lib/CatalogContext'
import { ToastContextProvider } from '../lib/ToastContext'
import * as default_translations from '../translations/en.js'
import CatalogSeo from './_seo'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  adjustFontFallback: false
})

const ApplicationDefaultContexts = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}/tenant`)
      .then(response => response.json())
      .then(({ tenant }) => setCurrentTenant(tenant))
  }, [])

  return (
    <>
      {currentTenant && (
        <CatalogContext>
          <ToastContextProvider>
            <CatalogSeo currentTenant={currentTenant} />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID} />
            {children}
          </ToastContextProvider>
        </CatalogContext>
      )}
    </>
  )
}

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const { locale } = router
  const [messages, setMessages] = useState({})

  const loadMessages = (locale) => {
    switch (locale) {
      case 'cs':
        return import('../translations/cs.js')
      case 'de':
        return import('../translations/de.js')
      case 'es':
        return import('../translations/es.js')
      case 'fr':
        return import('../translations/fr.js')
      case 'pt':
        return import('../translations/pt.js')
      case 'sw':
        return import('../translations/sw.js')
      default:
        return import('../translations/en.js')
    }
  }

  useEffect(() => {
    loadMessages(locale).then((data) => {setMessages({ ...default_translations.en, ...data[locale] })})
  }, [locale])

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
