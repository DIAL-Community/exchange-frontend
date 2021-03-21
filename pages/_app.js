import { Provider } from 'next-auth/client'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'

import * as translations from '../translations'

import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale } = router
  const messages = translations[locale]

  return (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </IntlProvider>
  )
}

export default MyApp
