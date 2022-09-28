import EditUser from '../../../pages/users/[userId]/edit'
import { USER_QUERY } from '../../../queries/user'
import { waitForAllEffectsAndSelectToLoad, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { user } from './data/UserEditPage'

mockNextUseRouter()
describe('Unit test for the EditUser component.', () => {
  const userId = '1'
  const mockUser = generateMockApolloData(USER_QUERY, { userId, locale: 'en' }, null, user)

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
