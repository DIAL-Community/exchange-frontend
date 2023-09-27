import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import OrganizationMain from '../../../components/organization/OrganizationMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_ORGANIZATIONS_QUERY
} from '../../../components/shared/query/organization'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { OrganizationFilterProvider } from '../../../components/context/OrganizationFilterContext'
import { paginatedOrganizations, organizationPaginationAttribute } from './data/OrganizationMain.data'

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
          <OrganizationFilterProvider>
            <OrganizationMain activeTab={0} />
          </OrganizationFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Newlogic')).toBeInTheDocument()
    expect(await screen.findByText('Soldevelo')).toBeInTheDocument()
    expect(await screen.findByText('Summum Go Digital')).toBeInTheDocument()
    expect(await screen.findByText('Creative Space Startups')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
