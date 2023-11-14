import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import BuildingBlockMain from '../../../components/building-block/BuildingBlockMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_BUILDING_BLOCKS_QUERY
} from '../../../components/shared/query/buildingBlock'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { BuildingBlockFilterProvider } from '../../../components/context/BuildingBlockFilterContext'
import { paginatedBuildingBlocks, buildingBlockPaginationAttribute } from './data/BuildingBlockMain.data'

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
        showMature:false,
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
        showMature:false,
        showGovStackOnly: false,
        limit: 8,
        offset: 0
      },
      null,
      paginatedBuildingBlocks
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedBuildingBlocks, mockBuildingBlockPaginationAttribute]}>
        <QueryParamContextProvider>
          <BuildingBlockFilterProvider>
            <BuildingBlockMain activeTab={0} />
          </BuildingBlockFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()
    expect(await screen.findByText('Artificial intelligence')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
