import { screen } from '@testing-library/dom'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubResources from '../../../components/hub/sections/HubResources'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../../components/shared/query/resource'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { resourcePagination, resources } from './data/HubCountry.data'
import { countriesWithResources, resourceTypes } from './data/HubResourceFinder.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockResourceTypes = generateMockApolloData(
    RESOURCE_TYPE_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    resourceTypes
  )

  const mockCountriesWithResources = generateMockApolloData(
    COUNTRIES_WITH_RESOURCES_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    countriesWithResources
  )

  const mockResources = generateMockApolloData(
    PAGINATED_RESOURCES_QUERY,
    {
      'search': '',
      'countries': [],
      'resourceTypes': [],
      'resourceTopics':[],
      'limit': 6,
      'offset': 0
    },
    null,
    resources
  )

  const mockResourcePagination = generateMockApolloData(
    RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
    {
      'search': '',
      'countries': [],
      'resourceTypes': [],
      'resourceTopics':[]
    },
    null,
    resourcePagination
  )

  test('Should render resource finder page.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockResourceTypes,
          mockCountriesWithResources,
          mockResources,
          mockResourcePagination
        ]}
      >
        <QueryParamContextProvider>
          <ResourceFilterProvider>
            <HubResources pageNumber={0} onClickHandler={() => {}} />
          </ResourceFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Stats SL Open Data Dashboard')).toBeInTheDocument()
    expect(await screen.findByText('Sierra Leone Data Portal')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
