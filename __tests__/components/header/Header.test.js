import { fireEvent } from '@testing-library/dom'
import Header from '../../../components/Header'
import { render } from '../../test-utils'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import CustomMockedProvider from '../../utils/CustomMockedProvider'

mockNextUseRouter()
describe('Unit test for the Header component.', () => {
  const ADMIN_MENU_TEST_ID = 'menu-admin'
  const ADMIN_MENU_ITEMS_TEST_ID = 'menu-admin-items'

  test('Should match snapshot.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true, roles: 'admin' })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <Header />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(ADMIN_MENU_TEST_ID))
    expect(getByTestId(ADMIN_MENU_ITEMS_TEST_ID)).toMatchSnapshot()
  })
})
