import { render, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import * as translations from '../translations'
import { ToastContextProvider } from '../lib/ToastContext'

const Providers = ({ children }) => {
  const locale = 'en'
  const messages = { ...translations.en, ...translations[locale] }
  
  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      <ToastContextProvider>
        {children}
      </ToastContextProvider>
    </IntlProvider>
  )
}

const customRender = (ui, options = {}) => render(ui, { wrapper: Providers, ...options })

// Mocked router implementation.
export const mockRouterImplementation = () => useRouter.mockImplementation(() => ({
  asPath: '/',
  locale: 'en',
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn()
  }
}))

// Mocked session implementation.
export const mockSessionImplementation = (canEdit = false) => useSession.mockReturnValue([{ user: { canEdit }}, false])

export const waitForReactSelectToLoad = (container) => (
  waitFor(() => expect(container.querySelector('.react-select__loading-indicator')).toBeNull())
)

// override render method
export { customRender as render }
