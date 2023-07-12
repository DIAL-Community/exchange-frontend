import UseCaseDetailLeft from '../../../components/use-cases/UseCaseDetailLeft'
import { COMMENTS_COUNT_QUERY } from '../../../queries/comment'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { useCase } from './data/UseCaseForm'

mockNextUseRouter()
describe('UseCaseDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  const commentVars = { commentObjectId: 1, commentObjectType:'USE_CASE' }
  const commentData = { 'data': { 'countComments': 0 } }
  const mockComment = generateMockApolloData(COMMENTS_COUNT_QUERY, commentVars, null, commentData)

  describe('Edit button', () => {
    test('Should not be visible for user who is not an admin.', () => {
      mockNextAuthUseSession(statuses.UNAUTHENTICATED)
      const { queryByTestId } = render(
        <CustomMockedProvider mocks={[mockComment]}>
          <UseCaseDetailLeft useCase={useCase} />
        </CustomMockedProvider>
      )

      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
    })

    test('Should be visible for authorized user.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockComment]}>
          <UseCaseDetailLeft
            useCase={useCase}
            canEdit={true}
          />
        </CustomMockedProvider>
      )

      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
    })
    test('Should have specific href attribute.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockComment]}>
          <UseCaseDetailLeft
            useCase={useCase}
            canEdit={true}
          />
        </CustomMockedProvider>
      )

      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/use_cases/${useCase.slug}/edit`)
    })
  })
})
