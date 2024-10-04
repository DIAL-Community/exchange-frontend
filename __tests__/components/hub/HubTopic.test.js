import { screen } from '@testing-library/dom'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubTopic from '../../../components/hub/sections/HubTopic'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../../components/shared/query/resource'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../../../components/shared/query/resourceTopic'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { resourcePagination, resources } from './data/HubCountry.data'
import { resourceTypes } from './data/HubResourceFinder.data'
import { countriesWithResources, resourceTopic } from './data/HubTopic.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockResourceTopic = generateMockApolloData(
    RESOURCE_TOPIC_DETAIL_QUERY,
    {
      'slug': 'data-privacy'
    },
    null,
    resourceTopic
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

  const mockResources = generateMockApolloData(
    PAGINATED_RESOURCES_QUERY,
    {
      'search': '',
      'countries': [],
      'resourceTypes': [],
      'resourceTopics': ['Data Privacy'],
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
      'resourceTopics': ['Data Privacy']
    },
    null,
    resourcePagination
  )

  test('Should render topic tiles page.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockResourceTypes,
          mockResourceTopic,
          mockCountriesWithResources,
          mockResources,
          mockResourcePagination
        ]}
      >
        <QueryParamContextProvider>
          <ResourceFilterProvider>
            <FilterProvider>
              <HubTopic slug='data-privacy' pageNumber={0} onClickHandler={() => { }} />
            </FilterProvider>
          </ResourceFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Data Privacy')).toBeInTheDocument()
    expect(await screen.findByText('Stats SL Open Data Dashboard')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
