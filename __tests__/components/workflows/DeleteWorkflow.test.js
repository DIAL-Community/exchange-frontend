import { fireEvent, waitFor } from '@testing-library/react'
import DeleteWorkflow from '../../../components/workflows/DeleteWorkflow'
import { DELETE_WORKFLOW } from '../../../mutations/workflow'
import { WORKFLOW_DETAIL_QUERY } from '../../../queries/workflow'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { workflow } from './data/WorkflowForm'

mockNextUseRouter()
describe('Unit tests for the DeleteWorkflow component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open confirmation dialog after clicking delete button.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteWorkflow workflow={workflow}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close confirmation dialog.', () => {
    test('after clicks "Cancel" button.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteWorkflow workflow={workflow} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('Should failed to execute mutation after clicking confirm button.', async () => {
      const mockFailedMutation = generateMockApolloData(
        DELETE_WORKFLOW,
        { id: workflow.id },
        new Error('An error occurred')
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockFailedMutation]}>
          <DeleteWorkflow workflow={workflow} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Workflow record deletion failed.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })

    test('Should successfully execute mutation after clicking confirm button.', async () => {
      const mockSuccessfulMutation = generateMockApolloData(
        DELETE_WORKFLOW,
        { id: workflow.id },
        null,
        {
          data: {
            deleteWorkflow: {
              workflow: {
                id: workflow.id,
                name: workflow.name,
                slug: workflow.slug
              },
              errors: []
            }
          }
        }
      )

      const mockDetailQuery = generateMockApolloData(
        WORKFLOW_DETAIL_QUERY,
        { slug: workflow.slug },
        null,
        {
          data: {
            workflow
          }
        }
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockDetailQuery, mockSuccessfulMutation]}>
          <DeleteWorkflow workflow={workflow}/>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Workflow record deleted successfully.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
