import { screen } from '@testing-library/dom'
import { ProductFilterProvider } from '../../../components/context/ProductFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubCountry from '../../../components/hub/sections/HubCountry'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY, DPI_COUNTRY_DETAIL_QUERY } from '../../../components/shared/query/country'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { countriesWithResources, countryResources } from './data/HubCountry.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
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

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountry, mockCountriesWithResources]}>
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
