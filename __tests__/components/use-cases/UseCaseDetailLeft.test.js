import UseCaseDetailLeft from '../../../components/use-cases/UseCaseDetailLeft'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { useCase } from './data/UseCaseForm'

mockNextUseRouter()
describe('UseCaseDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  describe('Edit button', () => {
    test('Should not be visible for user who is not an admin.', () => {
      mockNextAuthUseSession(statuses.UNAUTHENTICATED)
      const { queryByTestId } = render(
        <CustomMockedProvider>
          <UseCaseDetailLeft useCase={useCase} />
        </CustomMockedProvider>
      )

      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
    })

    test('Should be visible for authorized user.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { getByTestId } = render(
        <CustomMockedProvider>
          <UseCaseDetailLeft
            useCase={useCase}
            canEdit={true}
          />
        </CustomMockedProvider>
      )

      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
    })
    test('Should have specific href attribute.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { getByTestId } = render(
        <CustomMockedProvider>
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
