// Capture and mock the next's router implementation
export const mockedUseRouter = jest.spyOn(require('next/router'), 'useRouter')
export const mockedUseSession = jest.spyOn(require('next-auth/react'), 'useSession')

/**
 * Default properties of mocked useRouter implementation.
 */
const useRouterDefaultValues = {
  route: '/',
  pathname: '/',
  asPath: '/',
  query: {},
  locale: 'en',
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  },
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true))
}

/**
 * Implementation of the mocked useRouter function.
 */
export const mockNextUseRouter = (values = {}) => {
  // Merge the events (nested field).
  let events = useRouterDefaultValues.events
  if (values.events) {
    events = { ...events, ...values.events }
  }

  // Merge the top level fields.
  const mergedValues = { ...useRouterDefaultValues, ...values }

  // Overwrite the nested value with merged values
  mergedValues.events = events

  mockedUseRouter.mockImplementation(() => ({ ...mergedValues }))
}

export const mockTenantApi = (tenant = 'default', secured = false, hostname = 'default') => {
  //  Mock tenant API call for not-secured tenant
  jest
    .spyOn(global, 'fetch')
    .mockImplementation(
      jest.fn(
        () => Promise.resolve({
          json: () => Promise.resolve({ tenant, secured, hostname })
        })
      )
    )
}

/**
 * Default properties of mocked useSession implementation.
 */
export const sessionDefaultValues = {
  data: {
    user: {
      id: 1,
      userEmail: 'some-fake@email.com',
      userToken: 'some-fake-user-token',
      userName: 'some-fake-username',
      isAdminUser: true,
      isEditorUser: false
    }
  },
  status: 'authenticated'
}

export const statuses = {
  AUTHENTICATED: 'authenticated',
  LOADING: 'loading',
  UNAUTHENTICATED: 'unauthenticated'
}

/**
 * Implementation of the mocked useSession function.
 */
export const mockNextAuthUseSession = (status = statuses.AUTHENTICATED, userProps = {}) => {
  if (status === statuses.AUTHENTICATED) {
    const mergedSessionValues = { ...sessionDefaultValues }
    const userData = { ...sessionDefaultValues.data.user, ...userProps, ...{ status } }

    mergedSessionValues.data.user = userData

    mockedUseSession.mockImplementation(() => ({ ...mergedSessionValues }))
  } else {
    // UNAUTHENTICATED and LOADING will not have session data in them.
    mockedUseSession.mockImplementation(() => ({ status }))
  }
}
