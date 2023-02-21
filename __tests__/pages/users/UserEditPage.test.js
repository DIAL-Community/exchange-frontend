import EditUser from '../../../pages/users/[userId]/edit'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY, USER_QUERY, USER_ROLES } from '../../../queries/user'
import { waitForAllEffectsAndSelectToLoad, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, sessionDefaultValues, statuses }
  from '../../utils/nextMockImplementation'
import { user } from './data/UserEditPage'

mockNextUseRouter({ query: { userId: sessionDefaultValues.data.user.id } })
describe('Unit test for the EditUser component.', () => {
  const mockUser = generateMockApolloData(
    USER_QUERY,
    { userId: sessionDefaultValues.data.user.id, locale: 'en' },
    null,
    user
  )
  const mockedAuthCheck = generateMockApolloData(
    USER_AUTHENTICATION_TOKEN_CHECK_QUERY,
    {
      userId: sessionDefaultValues.data.user.id,
      userAuthenticationToken: sessionDefaultValues.data.user.userToken
    },
    null,
    { data: { userAuthenticationTokenCheck: true } }
  )
  const mockUserRoles = generateMockApolloData(
    USER_ROLES,
    {},
    null,
    { data: { userRoles: ['admin', 'user'] } }
  )
  const mockSearchOrganizations = generateMockApolloData(
    ORGANIZATION_SEARCH_QUERY,
    { search: '' },
    null,
    { data: { organizations: [] } }
  )
  const mockSearchProducts = generateMockApolloData(
    PRODUCT_SEARCH_QUERY,
    { search: '' },
    null,
    { data: { products: [] } }
  )

  describe('Should match snapshot', () => {
    test('- unauthorized.', async () => {
      mockNextAuthUseSession(statuses.UNAUTHENTICATED)
      const { container, getByText } = render(
        <CustomMockedProvider>
          <EditUser />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(getByText('You are not authorized to view this page')).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('- edit.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, queryByText } = render(
        <CustomMockedProvider
          mocks={[
            mockedAuthCheck,
            mockUser,
            mockUserRoles,
            mockSearchOrganizations,
            mockSearchProducts
          ]}
          allowDebugMessage
        >
          <EditUser />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(queryByText('You are not authorized to view this page')).not.toBeInTheDocument()
      expect(queryByText('404 - Page Not Found')).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
