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
export const mockRouterImplementation = (query = {}) => useRouter.mockImplementation(() => ({
  asPath: '/',
  locale: 'en',
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn()
  },
  query
}))

// Mocked session implementation.
export const mockSessionImplementation = (canEdit = false, userProps = {}) => useSession.mockReturnValue([{ user: { ...userProps, canEdit } }, false])

export const mockUnauthorizedUserSessionImplementation = () => useSession.mockReturnValue([false])

const waitForReactSelectToLoad = (container) => (
  waitFor(() => expect(container.querySelector('.react-select__loading-indicator')).toBeNull())
)

export const waitForAllEffects = (waitTimeout = 0) => waitFor(() => new Promise((res) => setTimeout(res, waitTimeout)))

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
