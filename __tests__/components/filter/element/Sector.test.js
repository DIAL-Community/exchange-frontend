import { fireEvent } from '@testing-library/dom'
import { render, waitForAllEffectsAndSelectToLoad } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { SectorAutocomplete } from '../../../../components/filter/element/Sector'
import { SECTOR_SEARCH_QUERY } from '../../../../queries/sector'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { sectors } from './data/SectorAutocomplete'

mockNextUseRouter()
describe('Unit test for the SectorAutocomplete component.', () => {
  const mockSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)
  const SECTOR_SEARCH_TEST_ID = 'sector-search'

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <SectorAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <SectorAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Sector 1')
    expect(container).toHaveTextContent('Sector 2')
    expect(container).toMatchSnapshot()
  })
})
