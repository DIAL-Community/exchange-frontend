import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { SDGAutocomplete } from '../../../../components/filter/element/SDG'
import { SDG_SEARCH_QUERY } from '../../../../queries/sdg'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { sdgs } from './data/SDGAutocomlete'

mockNextUseRouter()
describe('Unit test for the SDGAutocomplete component.', () => {
  const mockSdgs = generateMockApolloData(SDG_SEARCH_QUERY, { search: '' }, null, sdgs)
  const SGD_SEARCH_TEST_ID = 'sdg-search'

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSdgs]}>
        <SDGAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSdgs]}>
        <SDGAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(SGD_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('SDGs 1')
    expect(container).toHaveTextContent('SDGs 2')
    expect(container).toMatchSnapshot()
  })
})
