import { fireEvent, screen } from '@testing-library/react'
import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { WORKFLOW_SEARCH_QUERY } from '../../../../queries/workflow'
import UseCaseStepDetailWorkflows from '../../../../components/use-cases/steps/UseCaseStepDetailWorkflows'
import { workflows } from './data/UseCaseStepDetailWorkflows'
import { useCaseStep } from './data/UseCaseStepForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the UseCaseStepDetailWorkflows component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const WORKFLOW_SEARCH_TEST_ID = 'workflow-search'
  const WORKFLOW_SEARCH_OPTION_LABEL = 'Another Workflow'
  const USECASE_TEST_WORKFLOW_LABEL = 'Test Workflow'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockWorkflows = generateMockApolloData(WORKFLOW_SEARCH_QUERY, { search: '' }, null, workflows)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <UseCaseStepDetailWorkflows
          canEdit={false}
          useCaseStep={useCaseStep}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <UseCaseStepDetailWorkflows
          canEdit={false}
          useCaseStep={useCaseStep}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <UseCaseStepDetailWorkflows
          canEdit={true}
          useCaseStep={useCaseStep}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <UseCaseStepDetailWorkflows
          canEdit={true}
          useCaseStep={useCaseStep}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <UseCaseStepDetailWorkflows
          canEdit={true}
          useCaseStep={useCaseStep}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(WORKFLOW_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(WORKFLOW_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(WORKFLOW_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(USECASE_TEST_WORKFLOW_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(WORKFLOW_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(USECASE_TEST_WORKFLOW_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(WORKFLOW_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
