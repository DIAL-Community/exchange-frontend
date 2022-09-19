import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import WorkflowDetailLeft from '../../../components/workflows/WorkflowDetailLeft'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { workflow } from './data/WorkflowForm'

mockNextUseRouter()
describe('Unit test for the WorkflowDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })

    const { queryByTestId } = render(
      <CustomMockedProvider>
        <WorkflowDetailLeft workflow={workflow} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <WorkflowDetailLeft workflow={workflow} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to workflow edit form', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <WorkflowDetailLeft workflow={workflow} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/workflows/${workflow.slug}/edit`)
  })
})
