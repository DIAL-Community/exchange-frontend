import { DiscourseProvider } from '../../../components/context/DiscourseContext'
import UseCaseDetailLeft from '../../../components/use-cases/UseCaseDetailLeft'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  mockUnauthorizedUserSessionImplementation,
  render
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { useCase } from './data/UseCaseForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('UseCaseDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  beforeAll(() => {
    mockRouterImplementation()
  })

  describe(' Edit button', () => {
    test('Should not be visible for user who is not an admin.', () => {
      mockUnauthorizedUserSessionImplementation()
      const { queryByTestId } = render(
        <CustomMockedProvider>
          <DiscourseProvider>
            <UseCaseDetailLeft useCase={useCase} />
          </DiscourseProvider>
        </CustomMockedProvider>
      )

      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
    })

    test('Should be visible for authorized user.', async () => {
      mockSessionImplementation()
      const { getByTestId } = render(
        <CustomMockedProvider>
          <DiscourseProvider>
            <UseCaseDetailLeft
              useCase={useCase}
              canEdit={true}
            />
          </DiscourseProvider>
        </CustomMockedProvider>
      )

      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
    })
    test('Should have specific href attribute.', () => {
      mockSessionImplementation()
      const { getByTestId } = render(
        <CustomMockedProvider>
          <DiscourseProvider>
            <UseCaseDetailLeft
              useCase={useCase}
              canEdit={true}
            />
          </DiscourseProvider>
        </CustomMockedProvider>
      )

      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/use_cases/${useCase.slug}/edit`)
    })
  })
})
