import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { OperatorAutocomplete } from '../../../../components/filter/element/Operator'
import { OPERATOR_SEARCH_QUERY } from '../../../../queries/operator'
import { operatorServiceOnly } from './data/OperatorAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the OperatorAutocomplete component.', () => {
  const mockOperators = generateMockApolloData(OPERATOR_SEARCH_QUERY, { search: '' }, null, operatorServiceOnly)
  const OPERATOR_SEARCH_TEST_ID = 'operator-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOperators]}>
        <OperatorAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOperators]}>
        <OperatorAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(OPERATOR_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })
    await waitForAllEffectsAndSelectToLoad(container)
    
    expect(container).toHaveTextContent('Operators 1')
    expect(container).toHaveTextContent('Operators 2')
    expect(container).toMatchSnapshot()
  })
})
