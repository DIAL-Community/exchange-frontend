import { act } from 'react'
import { screen } from '@testing-library/dom'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import OrganizationMain from '../../../components/organization/OrganizationMain'
import {
  ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_ORGANIZATIONS_QUERY
} from '../../../components/shared/query/organization'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { organizationPaginationAttribute, paginatedOrganizations } from './data/OrganizationMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the organization main page.', () => {
  test('Should render list of organizations.', async () => {
    const mockOrganizationPaginationAttribute = generateMockApolloData(
      ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        countries: [],
        sectors: [],
        years: [],
        aggregatorOnly: false,
        endorserOnly: false
      },
      null,
      organizationPaginationAttribute
    )
    const mockPaginatedOrganizations = generateMockApolloData(
      PAGINATED_ORGANIZATIONS_QUERY,
      {
        search: '',
        countries: [],
        sectors: [],
        years: [],
        aggregatorOnly: false,
        endorserOnly: false,
        limit: 8,
        offset: 0
      },
      null,
      paginatedOrganizations
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedOrganizations, mockOrganizationPaginationAttribute]}>
        <QueryParamContextProvider>
          <FilterProvider>
            <OrganizationMain activeTab={0} />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Newlogic')).toBeInTheDocument()
    expect(await screen.findByText('Soldevelo')).toBeInTheDocument()
    expect(await screen.findByText('Summum Go Digital')).toBeInTheDocument()
    expect(await screen.findByText('Creative Space Startups')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
