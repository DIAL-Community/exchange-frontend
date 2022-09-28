import { render, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { SessionProvider } from 'next-auth/react'
import { act } from 'react-dom/test-utils'
import * as translations from '../translations'
import { ToastContextProvider } from '../lib/ToastContext'

const Providers = ({ children }) => {
  const locale = 'en'
  const messages = { ...translations.en, ...translations[locale] }

  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      <ToastContextProvider>
        <SessionProvider session>
          {children}
        </SessionProvider>
      </ToastContextProvider>
    </IntlProvider>
  )
}

const customRender = (ui, options = {}) => render(ui, { wrapper: Providers, ...options })

const waitForReactSelectToLoad = (container) => (
  waitFor(() => expect(container.querySelector('.react-select__loading-indicator')).toBeNull())
)

export const waitForAllEffects = async (waitTimeout = 100) => (
  await act(() => new Promise((resolve) => setTimeout(resolve, waitTimeout)))
)

export const waitForAllEffectsAndSelectToLoad = async (container) => (
  await waitForAllEffects().then(() => waitForReactSelectToLoad(container))
)

// Mocked intersection observer for Headless UI Dialog component.
export const mockObserverImplementation = () => jest.fn(() => ({
  observe: () => jest.fn(),
  disconnect: () => jest.fn(),
  unobserve: () => jest.fn()
}))

export const mockArcGisToken = () => fetch.mockResponse(JSON.stringify({ token: 'test-token' }))

// override render method
export { customRender as render }
