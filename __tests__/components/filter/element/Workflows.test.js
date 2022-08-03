import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { WorkflowAutocomplete } from '../../../../components/filter/element/Workflow'
import { WORKFLOW_SEARCH_QUERY } from '../../../../queries/workflow'
import { workflows } from './data/WorkflowAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the WorkflowAutocomplete component.', () => {
  const mockWorkflows = generateMockApolloData(WORKFLOW_SEARCH_QUERY, { search: '' }, null, workflows)
  const WORKFLOWS_SEARCH_TEST_ID = 'workflow-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <WorkflowAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockWorkflows]}>
        <WorkflowAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(WORKFLOWS_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })
    
    expect(container).toHaveTextContent('Workflow 1')
    expect(container).toHaveTextContent('Workflow 2')
    expect(container).toMatchSnapshot()
  })
})
