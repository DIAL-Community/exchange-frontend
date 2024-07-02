import { screen } from '@testing-library/dom'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubTopic from '../../../components/hub/sections/HubTopic'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import { RESOURCE_TOPIC_DETAIL_QUERY, RESOURCE_TOPIC_RESOURCES_QUERY } from '../../../components/shared/query/resourceTopic'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { countriesWithResources, resourceTopic, resourceTopicResources } from './data/HubTopic.data'

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

  const mockResourceTopicResources = generateMockApolloData(
    RESOURCE_TOPIC_RESOURCES_QUERY,
    {
      'slug': 'data-privacy',
      'search': '',
      'countries': [],
      'resourceTypes': []
    },
    null,
    resourceTopicResources
  )

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockResourceTopic, mockCountriesWithResources, mockResourceTopicResources]}>
        <QueryParamContextProvider>
          <FilterContextProvider>
            <ResourceFilterProvider>
              <HubTopic slug='data-privacy' />
            </ResourceFilterProvider>
          </FilterContextProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Data Privacy')).toBeInTheDocument()
    expect(await screen.findByText('Renegotiating the Faustian Bargain for Data')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
