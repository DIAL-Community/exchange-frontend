import { screen } from '@testing-library/dom'
import { ProductFilterProvider } from '../../../components/context/ProductFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubCountry from '../../../components/hub/sections/HubCountry'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY, DPI_COUNTRY_DETAIL_QUERY } from '../../../components/shared/query/country'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../../components/shared/query/resource'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import {
  countriesWithResources, countryResources, policyResourcePagination, policyResources, websiteResourcePagination,
  websiteResources
} from './data/HubCountry.data'
import { resourceTypes } from './data/HubResourceFinder.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockPolicyResources = generateMockApolloData(
    PAGINATED_RESOURCES_QUERY,
    {
      'search': '',
      'countries': ['15'],
      'resourceTypes' :['Government Document'],
      'limit': 6,
      'offset': 0
    },
    null,
    policyResources
  )

  const mockPolicyResourcePagination = generateMockApolloData(
    RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
    {
      'search': '',
      'countries': ['15'],
      'resourceTypes': ['Government Document']
    },
    null,
    policyResourcePagination
  )

  const mockWebsiteResources = generateMockApolloData(
    PAGINATED_RESOURCES_QUERY,
    {
      'search': '',
      'countries': ['15'],
      'resourceTypes': ['National Website'],
      'limit': 6,
      'offset': 0
    },
    null,
    websiteResources
  )

  const mockWebsiteResourcePagination = generateMockApolloData(
    RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
    {
      'search': '',
      'countries': ['15'],
      'resourceTypes': ['National Website']
    },
    null,
    websiteResourcePagination
  )

  const mockCountry = generateMockApolloData(
    DPI_COUNTRY_DETAIL_QUERY,
    {
      'slug': 'zambia'
    },
    null,
    countryResources
  )

  const mockCountriesWithResources = generateMockApolloData(
    COUNTRIES_WITH_RESOURCES_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    countriesWithResources
  )

  const mockResourceTypes = generateMockApolloData(
    RESOURCE_TYPE_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    resourceTypes
  )

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockCountry,
          mockCountriesWithResources,
          mockPolicyResources,
          mockPolicyResourcePagination,
          mockWebsiteResources,
          mockWebsiteResourcePagination,
          mockResourceTypes
        ]}
      >
        <QueryParamContextProvider>
          <ResourceFilterProvider>
            <ProductFilterProvider>
              <HubCountry slug='zambia' />
            </ProductFilterProvider>
          </ResourceFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Zambia')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
