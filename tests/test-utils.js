import { render } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import * as translations from '../translations'

const Providers = ({ children }) => {
  const locale = 'en'
  const messages = { ...translations.en, ...translations[locale] }
  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      {children}
    </IntlProvider>
  )
}

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

// override render method
export { customRender as render }
