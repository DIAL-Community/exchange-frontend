import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { BuildingBlockAutocomplete } from '../../../../components/filter/element/BuildingBlock'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../../queries/building-block'
import { buildingBlocks } from './data/BuildingBlockAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the BuildingBlockAutocomplete component.', () => {
  const mockBuildingBlocks = generateMockApolloData(BUILDING_BLOCK_SEARCH_QUERY, { search: '' }, null, buildingBlocks)
  const BUILDING_BLOCK_SEARCH_TEST_ID = 'building-block-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockBuildingBlocks]}>
        <BuildingBlockAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockBuildingBlocks]}>
        <BuildingBlockAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(BUILDING_BLOCK_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('buildingBlocks 1')
    expect(container).toHaveTextContent('buildingBlocks 2')
    expect(container).toMatchSnapshot()
  })
})
