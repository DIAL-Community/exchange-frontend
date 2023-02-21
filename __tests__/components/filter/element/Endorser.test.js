import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { EndorserAutocomplete } from '../../../../components/filter/element/Endorser'
import { ENDORSER_SEARCH_QUERY } from '../../../../queries/endorser'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { endorsers } from './data/EndorserAutocomplete'

mockNextUseRouter()
describe('Unit test for the EndorserAutocomplete component.', () => {
  const mockEndorsers = generateMockApolloData(ENDORSER_SEARCH_QUERY, { search: '' }, null, endorsers)
  const ENDORSER_SEARCH_TEST_ID = 'endorser-search'

  test('Should match snapshot.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockEndorsers]}>
        <EndorserAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockEndorsers]}>
        <EndorserAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(ENDORSER_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Endorser 1')
    expect(container).toHaveTextContent('Endorser 2')
    expect(container).toMatchSnapshot()
  })
})
