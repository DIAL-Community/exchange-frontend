import { screen } from '@testing-library/dom'
import BuildingBlockMain from '../../../components/building-block/BuildingBlockMain'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import {
  BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_BUILDING_BLOCKS_QUERY
} from '../../../components/shared/query/buildingBlock'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { buildingBlockPaginationAttribute, paginatedBuildingBlocks } from './data/BuildingBlockMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the building block main page.', () => {
  test('Should render list of building blocks.', async () => {
    const mockBuildingBlockPaginationAttribute = generateMockApolloData(
      BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        sdgs: [],
        useCases: [],
        workflows: [],
        categoryTypes: [],
        showMature: false,
        showGovStackOnly: false
      },
      null,
      buildingBlockPaginationAttribute
    )
    const mockPaginatedBuildingBlocks = generateMockApolloData(
      PAGINATED_BUILDING_BLOCKS_QUERY,
      {
        search: '',
        sdgs: [],
        useCases: [],
        workflows: [],
        categoryTypes: [],
        showMature: false,
        showGovStackOnly: false,
        limit: 12,
        offset: 0
      },
      null,
      paginatedBuildingBlocks
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedBuildingBlocks, mockBuildingBlockPaginationAttribute]}>
        <QueryParamContextProvider>
          <FilterProvider>
            <BuildingBlockMain activeTab={0} />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()
    expect(await screen.findByText('Artificial intelligence')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
