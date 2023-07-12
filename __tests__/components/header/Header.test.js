import { fireEvent } from '@testing-library/dom'
import Header from '../../../components/Header'
import { render } from '../../test-utils'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../../../queries/user'

mockNextUseRouter()
describe('Unit test for the Header component.', () => {
  const ADMIN_MENU_TEST_ID = 'menu-admin'
  const ADMIN_MENU_ITEMS_TEST_ID = 'menu-admin-items'

  const mockCheckData = { data: { userAuthenticationTokenCheck: null } }
  const mockCheckVars = { userId: 1, userAuthenticationToken: 'some-fake-user-token' }
  const mockCheckQuery = generateMockApolloData(
    USER_AUTHENTICATION_TOKEN_CHECK_QUERY,
    mockCheckVars,
    null,
    mockCheckData
  )

  test('Should match snapshot.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true, roles: 'admin' })
    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockCheckQuery]}>
        <Header />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(ADMIN_MENU_TEST_ID))
    expect(getByTestId(ADMIN_MENU_ITEMS_TEST_ID)).toMatchSnapshot()
  })
})
