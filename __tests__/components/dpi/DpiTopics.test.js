import { screen } from '@testing-library/dom'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import DpiTopics from '../../../components/dpi/sections/DpiTopics'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../../components/shared/query/resourceTopic'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { resourceTopics } from './data/DpiTopics.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockResourceTiles = generateMockApolloData(
    RESOURCE_TOPIC_SEARCH_QUERY,
    {
      'search': ''
    },
    null,
    resourceTopics
  )

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockResourceTiles]}>
        <QueryParamContextProvider>
          <FilterContextProvider>
            <DpiTopics />
          </FilterContextProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI + Machine Learning')).toBeInTheDocument()
    expect(await screen.findByText('Consent')).toBeInTheDocument()
    expect(await screen.findByText('Data Privacy')).toBeInTheDocument()
    expect(await screen.findByText('Data Exchange')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
