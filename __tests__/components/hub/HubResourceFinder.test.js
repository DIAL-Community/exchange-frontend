import { screen } from '@testing-library/dom'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubResources from '../../../components/hub/sections/HubResources'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import { RESOURCE_TOPIC_RESOURCES_QUERY } from '../../../components/shared/query/resourceTopic'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { countriesWithResources, resourceTopicResources } from './data/HubResourceFinder.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockResourceTiles = generateMockApolloData(
    RESOURCE_TOPIC_RESOURCES_QUERY,
    {
      'slug': '',
      'search': '',
      'countries': [],
      'resourceTypes': []
    },
    null,
    resourceTopicResources
  )

  const mockCountriesWithResources = generateMockApolloData(
    COUNTRIES_WITH_RESOURCES_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    countriesWithResources
  )

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockResourceTiles, mockCountriesWithResources]}>
        <QueryParamContextProvider>
          <ResourceFilterProvider>
            <HubResources />
          </ResourceFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Co-Creating Our Digital Future')).toBeInTheDocument()
    expect(await screen.findByText('Human-Centered Data Governance')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
