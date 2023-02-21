import { fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects } from '../../test-utils'
import WorkflowForm from '../../../components/workflows/WorkflowForm'
import { CREATE_WORKFLOW } from '../../../mutations/workflow'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { workflow, createWorkflowSuccess } from './data/WorkflowForm'

mockNextUseRouter()
describe('Unit tests for WorkflowForm component.', () => {
  const WORKFLOW_NAME_TEST_ID = 'workflow-name'
  const WORKFLOW_DESCRIPTION_TEST_ID = 'workflow-description'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  describe('Should render Unauthorized component for', () => {
    test('unauthorized user.', async () => {
      mockNextAuthUseSession(statuses.UNAUTHENTICATED)
      const { container } = render(
        <CustomMockedProvider>
          <WorkflowForm />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(container).toHaveTextContent('You are not authorized to view this page')
      expect(container).toMatchSnapshot()
    })

    test('user who is not an admin.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })
      const { container } = render(
        <CustomMockedProvider>
          <WorkflowForm />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(container).toHaveTextContent('You are not authorized to view this page')
      expect(container).toMatchSnapshot()
    })
  })

  test('Should render WorkflowForm component for admin user.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container } = render(
      <CustomMockedProvider>
        <WorkflowForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <WorkflowForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(WORKFLOW_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(WORKFLOW_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test workflow name')
    expect(getByTestId(WORKFLOW_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await act(async () => waitFor(() => {
      user.clear(screen.getByLabelText(/Name/))
    }))
    expect(getByTestId(WORKFLOW_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test workflow name 2')
    expect(getByTestId(WORKFLOW_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(WORKFLOW_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(WORKFLOW_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(WORKFLOW_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(container).toMatchSnapshot()
  })

  describe('Should display toast on submit -', () => {
    test('Success.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const mockCreateWorkflow = generateMockApolloData(
        CREATE_WORKFLOW,
        {
          name: 'Test Workflow',
          slug: 'test_workflow',
          description: '<p>test workflow description</p>'
        },
        null,
        createWorkflowSuccess
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateWorkflow]} addTypename={false}>
          <WorkflowForm workflow={workflow} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      })
      await screen.findByText('Workflow submitted successfully')
      expect(container).toMatchSnapshot()
    })

    test('Failure.', async () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const errorMessage = 'An error occurred'
      const mockCreateWorkflow = generateMockApolloData(
        CREATE_WORKFLOW,
        {
          name: 'Test Workflow',
          slug: 'test_workflow',
          description: '<p>test workflow description</p>'
        },
        new Error(errorMessage)
      )
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockCreateWorkflow]}>
          <WorkflowForm workflow={workflow} />
        </CustomMockedProvider>
      )

      await waitForAllEffects()
      await act(async () => {
        fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
      })
      await screen.findByText('Workflow submission failed')
      await screen.findByText(errorMessage)
      expect(container).toMatchSnapshot()
    })
  })
})
