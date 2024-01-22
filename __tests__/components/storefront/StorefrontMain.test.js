import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import StorefrontMain from '../../../components/storefront/StorefrontMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  STOREFRONT_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_STOREFRONTS_QUERY
} from '../../../components/shared/query/organization'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { OrganizationFilterProvider } from '../../../components/context/OrganizationFilterContext'
import { paginatedStorefronts, storefrontPaginationAttribute } from './data/StorefrontMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the storefront main page.', () => {
  test('Should render list of storefronts.', async () => {
    const mockStorefrontPaginationAttribute = generateMockApolloData(
      STOREFRONT_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        countries: [],
        sectors: [],
        specialties: [],
        certifications: [],
        buildingBlocks: []
      },
      null,
      storefrontPaginationAttribute
    )
    const mockPaginatedStorefronts = generateMockApolloData(
      PAGINATED_STOREFRONTS_QUERY,
      {
        search: '',
        countries: [],
        sectors: [],
        specialties: [],
        certifications: [],
        buildingBlocks: [],
        limit: 8,
        offset: 0
      },
      null,
      paginatedStorefronts
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedStorefronts, mockStorefrontPaginationAttribute]}>
        <QueryParamContextProvider>
          <OrganizationFilterProvider>
            <StorefrontMain activeTab={0} />
          </OrganizationFilterProvider>
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
