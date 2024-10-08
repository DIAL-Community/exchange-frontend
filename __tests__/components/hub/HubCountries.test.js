import { screen } from '@testing-library/dom'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { ResourceFilterProvider } from '../../../components/context/ResourceFilterContext'
import HubCountries from '../../../components/hub/sections/HubCountries'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../../components/shared/query/country'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { countriesWithResources } from './data/HubCountries.data'

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

  test('Should render country tiles page.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountriesWithResources]}>
        <QueryParamContextProvider>
          <ResourceFilterProvider>
            <FilterProvider>
              <HubCountries />
            </FilterProvider>
          </ResourceFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Zambia')).toBeInTheDocument()
    expect(await screen.findByText('Uganda')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
