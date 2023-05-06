import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeleteUseCase from '../../../components/use-cases/DeleteUseCase'
import { DELETE_USE_CASE } from '../../../mutations/use-case'
import { USE_CASE_DETAIL_QUERY } from '../../../queries/use-case'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { useCase } from './data/UseCaseForm'

mockNextUseRouter()
describe('Unit tests for the DeleteUseCase component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open confirmation dialog after clicking delete button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteUseCase useCase={useCase}/>
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close confirmation dialog.', () => {
    test('after clicks "Cancel" button.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteUseCase useCase={useCase} />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('Should failed to execute mutation after clicking confirm button.', async () => {
      const mockFailedMutation = generateMockApolloData(
        DELETE_USE_CASE,
        { id: useCase.id },
        new Error('An error occurred')
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockFailedMutation]}>
          <DeleteUseCase useCase={useCase} />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(getByText('Use case record deletion failed.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })

    test('Should successfully execute mutation after clicking confirm button.', async () => {
      const mockSuccessfulMutation = generateMockApolloData(
        DELETE_USE_CASE,
        { id: useCase.id },
        null,
        {
          data: {
            deleteUseCase: {
              useCase: {
                id: useCase.id,
                name: useCase.name,
                slug: useCase.slug
              },
              errors: []
            }
          }
        }
      )

      const mockDetailData = { data: { useCase: null } }
      const mockDetailVars = { slug: 'test_use_case' }
      const mockDetailQuery = generateMockApolloData(USE_CASE_DETAIL_QUERY, mockDetailVars, null, mockDetailData)

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockDetailQuery, mockSuccessfulMutation]}>
          <DeleteUseCase useCase={useCase}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(getByText('Use case record deleted successfully.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
