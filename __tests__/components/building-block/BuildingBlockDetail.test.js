import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import BuildingBlockDetail from '../../../components/building-block/BuildingBlockDetail'
import BuildingBlockEdit from '../../../components/building-block/BuildingBlockEdit'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_BUILDING_BLOCK } from '../../../components/shared/mutation/buildingBlock'
import {
  BUILDING_BLOCK_DETAIL_QUERY, BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY, BUILDING_BLOCK_POLICY_QUERY,
  PAGINATED_BUILDING_BLOCKS_QUERY
} from '../../../components/shared/query/buildingBlock'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { buildingBlockDetail, commentsQuery, createBuildingBlock } from './data/BuildingBlockDetail.data'
import { buildingBlockPaginationAttribute, paginatedBuildingBlocks } from './data/BuildingBlockMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the building block detail page.', () => {
  const mockBuildingBlockPolicies = generateMockApolloData(
    BUILDING_BLOCK_POLICY_QUERY,
    { 'slug': 'xchange-graph-query-context-policies' },
    null,
    { data: { buildingBlock: null } }
  )

  const mockBuildingBlock = generateMockApolloData(
    BUILDING_BLOCK_DETAIL_QUERY,
    {
      'slug': 'analytics-and-business-intelligence'
    },
    null,
    buildingBlockDetail
  )

  const mockBuildingBlockComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 25,
      'commentObjectType': 'BUILDING_BLOCK'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a building block.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockBuildingBlockPolicies,
          mockBuildingBlock,
          mockBuildingBlockComments
        ]}
      >
        <QueryParamContextProvider>
          <FilterProvider>
            <BuildingBlockDetail slug='analytics-and-business-intelligence' />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unauthorized for non logged in user.', async () => {
    const graphQueryErrors = {
      graphQueryErrors: [{
        'message': 'Viewing is not allowed.',
        'locations': [
          {
            'line': 2,
            'column': 3
          }
        ],
        'path': [
          'buildingBlock'
        ],
        'extensions': {
          'code': QueryErrorCode.UNAUTHORIZED
        }
      }]
    }

    const buildingBlockPolicyQueryError = generateMockApolloData(
      BUILDING_BLOCK_DETAIL_QUERY,
      {
        'slug': 'analytics-and-business-intelligence'
      },
      graphQueryErrors,
      null
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockBuildingBlockComments,
          buildingBlockPolicyQueryError
        ]}
      >
        <FilterProvider>
          <QueryParamContextProvider>
            <BuildingBlockEdit slug='analytics-and-business-intelligence' />
          </QueryParamContextProvider>
        </FilterProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_BUILDING_BLOCK,
      {
        'name': 'Analytics and business intelligence - Edited',
        'slug': 'analytics-and-business-intelligence',
        'maturity': 'DRAFT',
        'category': null,
        'description': 'Building block description.',
        'specUrl': '',
        'govStackEntity': false
      },
      null,
      createBuildingBlock
    )
    const mockBuildingBlockPaginationAttribute = generateMockApolloData(
      BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: ''
      },
      null,
      buildingBlockPaginationAttribute
    )
    const mockPaginatedBuildingBlocks = generateMockApolloData(
      PAGINATED_BUILDING_BLOCKS_QUERY,
      {
        search: '',
        limit: 8,
        offset: 0
      },
      null,
      paginatedBuildingBlocks
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockBuildingBlock,
          mockCreateBuildingBlock,
          mockBuildingBlockComments,
          mockPaginatedBuildingBlocks,
          mockBuildingBlockPaginationAttribute
        ]}
      >
        <FilterProvider>
          <QueryParamContextProvider>
            <BuildingBlockEdit slug='analytics-and-business-intelligence' />
          </QueryParamContextProvider>
        </FilterProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Analytics and business intelligence')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('Analytics and business intelligence')
    expect(repositoryNameInput.value).toBe('Analytics and business intelligence')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('Analytics and business intelligence - Edited')

    const repositorySubmitButton = screen.getByText('Submit Building Block')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
