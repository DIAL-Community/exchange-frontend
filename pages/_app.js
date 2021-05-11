import { Provider } from 'next-auth/client'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'

import * as translations from '../translations'

import '../styles/globals.css'
import '../styles/filter.css'
import '../styles/sticky.css'
import '../styles/accordion.css'
import '../styles/view-content.css'
import '../styles/leaflet.css'
import '../styles/loading.css'

import CatalogContext from '../lib/CatalogContext'

function MyApp ({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale } = router
  const messages = translations[locale]

  return (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      <Provider session={pageProps.session}>
        <CatalogContext>
          <Component {...pageProps} />
        </CatalogContext>
      </Provider>
    </IntlProvider>
  )
}

export default MyApp
