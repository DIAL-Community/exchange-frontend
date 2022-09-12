import { fireEvent } from '@testing-library/dom'
import Header from '../../../components/Header'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the Header component.', () => {
  const ADMIN_MENU_TEST_ID = 'admin-menu'
  const ADMIN_MENU_ITEMS_TEST_ID = 'admin-menu-items'

  test('Should match snapshot.', () => {
    mockRouterImplementation()
    mockSessionImplementation(true, { roles: 'admin' })
    const { getByTestId } = render(
      <CustomMockedProvider>
        <Header />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(ADMIN_MENU_TEST_ID))
    expect(getByTestId(ADMIN_MENU_ITEMS_TEST_ID)).toMatchSnapshot()
  })
})
