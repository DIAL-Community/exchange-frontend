import { act } from 'react';
import { screen } from '@testing-library/dom';
import { FilterProvider } from '../../../components/context/FilterContext';
import {
  QueryParamContextProvider,
} from '../../../components/context/QueryParamContext';
import OpportunityMain from '../../../components/opportunity/OpportunityMain';
import {
  OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_OPPORTUNITIES_QUERY,
} from '../../../components/shared/query/opportunity';
import { render } from '../../test-utils';
import CustomMockedProvider, {
  generateMockApolloData,
} from '../../utils/CustomMockedProvider';
import {
  mockNextUseRouter, mockTenantApi,
} from '../../utils/nextMockImplementation';
import {
  opportunityPaginationAttribute, paginatedOpportunities,
} from './data/OpportunityMain.data';

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
          <FilterProvider>
            <OpportunityMain activeTab={0} />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Make your supply chain more sustainable')).toBeInTheDocument()
    expect(await screen.findByText('Improving cross-border e-Commerce services')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
