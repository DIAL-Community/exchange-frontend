import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import OpportunityMain from '../../../components/opportunity/OpportunityMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_OPPORTUNITIES_QUERY
} from '../../../components/shared/query/opportunity'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { OpportunityFilterProvider } from '../../../components/context/OpportunityFilterContext'
import { paginatedOpportunities, opportunityPaginationAttribute } from './data/OpportunityMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity main page.', () => {
  test('Should render list of opportunities.', async () => {
    const mockOpportunityPaginationAttribute = generateMockApolloData(
      OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        countries: [],
        buildingBlocks: [],
        organizations: [],
        useCases: [],
        sectors: [],
        tags: [],
        showClosed: false,
        showGovStackOnly: false
      },
      null,
      opportunityPaginationAttribute
    )
    const mockPaginatedOpportunities = generateMockApolloData(
      PAGINATED_OPPORTUNITIES_QUERY,
      {
        search: '',
        countries: [],
        buildingBlocks: [],
        organizations: [],
        useCases: [],
        sectors: [],
        tags: [],
        showClosed: false,
        showGovStackOnly: false,
        limit: 8,
        offset: 0
      },
      null,
      paginatedOpportunities
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedOpportunities, mockOpportunityPaginationAttribute]}>
        <QueryParamContextProvider>
          <OpportunityFilterProvider>
            <OpportunityMain activeTab={0} />
          </OpportunityFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Make your supply chain more sustainable')).toBeInTheDocument()
    expect(await screen.findByText('Improving cross-border e-Commerce services')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
