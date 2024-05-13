import { screen } from '@testing-library/dom'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import DpiCountries from '../../../components/dpi/sections/DpiCountries'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { countriesWithResources } from './data/DpiCountries.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
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
      <CustomMockedProvider mocks={[mockCountriesWithResources]}>
        <QueryParamContextProvider>
          <FilterContextProvider>
            <ResourceFilterProvider>
              <DpiCountries />
            </ResourceFilterProvider>
          </FilterContextProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Zambia')).toBeInTheDocument()
    expect(await screen.findByText('Uganda')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
