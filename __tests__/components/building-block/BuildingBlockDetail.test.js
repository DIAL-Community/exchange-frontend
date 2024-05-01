import { screen } from '@testing-library/dom'
import BuildingBlockDetail from '../../../components/building-block/BuildingBlockDetail'
import BuildingBlockEdit from '../../../components/building-block/BuildingBlockEdit'
import { BuildingBlockFilterProvider } from '../../../components/context/BuildingBlockFilterContext'
import { ProductFilterProvider } from '../../../components/context/ProductFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../../components/shared/query/buildingBlock'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { buildingBlockComments, buildingBlockDetail } from './data/BuildingBlockDetail.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the building block main page.', () => {
  const mockBuildingBlockPaginationAttribute = generateMockApolloData(
    BUILDING_BLOCK_DETAIL_QUERY,
    {
      'slug': 'analytics-and-business-intelligence'
    },
    null,
    buildingBlockDetail
  )

  const mockPaginatedBuildingBlocks = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 25,
      'commentObjectType': 'BUILDING_BLOCK'
    },
    null,
    buildingBlockComments
  )

  test('Should render detail of a building block.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedBuildingBlocks, mockBuildingBlockPaginationAttribute]}>
        <QueryParamContextProvider>
          <BuildingBlockFilterProvider>
            <ProductFilterProvider>
              <BuildingBlockDetail slug='analytics-and-business-intelligence' />
            </ProductFilterProvider>
          </BuildingBlockFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unathorized for non logged in user.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedBuildingBlocks, mockBuildingBlockPaginationAttribute]}>
        <QueryParamContextProvider>
          <BuildingBlockFilterProvider>
            <ProductFilterProvider>
              <BuildingBlockEdit slug='analytics-and-business-intelligence' />
            </ProductFilterProvider>
          </BuildingBlockFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()
    expect(await screen.findByText('You are not authorized to view this page')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
