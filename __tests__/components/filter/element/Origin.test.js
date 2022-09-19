import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { OriginAutocomplete } from '../../../../components/filter/element/Origin'
import { ORIGIN_SEARCH_QUERY } from '../../../../queries/origin'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { origins } from './data/OriginAutocomplete'

mockNextUseRouter()
describe('Unit test for the OriginAutocomplete component.', () => {
  const mockOrigins = generateMockApolloData(ORIGIN_SEARCH_QUERY, { search: '' }, null, origins)
  const ORIGINS_SEARCH_TEST_ID = 'origin-search'

  test('Should match snapshot.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrigins]}>
        <OriginAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrigins]}>
        <OriginAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(ORIGINS_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Origin 1')
    expect(container).toHaveTextContent('Origin 2')
    expect(container).toMatchSnapshot()
  })
})
