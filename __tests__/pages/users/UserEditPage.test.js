import EditUser from '../../../pages/users/[userId]/edit'
import { USER_QUERY } from '../../../queries/user'
import {
  waitForAllEffectsAndSelectToLoad,
  mockSessionImplementation,
  mockRouterImplementation,
  render
} from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { user } from './data/UserEditPage'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the EditUser component.', () => {
  const userId = '1'
  const mockUser = generateMockApolloData(USER_QUERY, { userId, locale: 'en' }, null, user)

  beforeAll(() => {
    mockRouterImplementation({ userId })
  })

  describe('Should match snapshot', () => {
    test('- unauthorized.', async () => {
      mockSessionImplementation()
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
      mockSessionImplementation(true)
      const { container, queryByText } = render(
        <CustomMockedProvider mocks={[mockUser]}>
          <EditUser />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(queryByText('You are not authorized to view this page')).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
