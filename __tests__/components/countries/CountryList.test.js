import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffects } from '../../test-utils'
import { UserFilterProvider } from '../../../components/context/UserFilterContext'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import CountryListQuery from '../../../components/countries/CountryList'
import { COUNTRIES_LIST_QUERY } from '../../../queries/country'
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants'
import { countryListData } from './data/CountryListData'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the CountryList component', () => {
  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation(true)
  })

  test('Should render error message when apollo returning error.', async () => {
    const variables = { first: DEFAULT_PAGE_SIZE, search: '' }
    const mockCountryList = generateMockApolloData(COUNTRIES_LIST_QUERY, variables, new Error('An error occurred'))
    const component = render(
      <CustomMockedProvider mocks={[mockCountryList]} addTypename={false}>
        <FilterContextProvider>
          <UserFilterProvider>
            <CountryListQuery />
          </UserFilterProvider>
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    await waitForAllEffects()

    expect(component.getByText(/Error fetching data/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('Should render list of countries.', async () => {
    const variables = { first: DEFAULT_PAGE_SIZE, search: '' }
    const mockCountryList = generateMockApolloData(COUNTRIES_LIST_QUERY, variables, null, countryListData)
    const component = render(
      <CustomMockedProvider mocks={[mockCountryList]} addTypename={false}>
        <FilterContextProvider>
          <UserFilterProvider>
            <CountryListQuery />
          </UserFilterProvider>
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    await waitForAllEffects()

    expect(component.getByText(/Afghanistan/)).toBeInTheDocument()
    expect(component.getByText(/Albania/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('Should render text with anchor for authorized users', async () => {
    const variables = { first: DEFAULT_PAGE_SIZE, search: '' }
    const mockCountryList = generateMockApolloData(COUNTRIES_LIST_QUERY, variables, null, countryListData)
    const component = render(
      <CustomMockedProvider mocks={[mockCountryList]} addTypename={false}>
        <FilterContextProvider>
          <UserFilterProvider>
            <CountryListQuery />
          </UserFilterProvider>
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    await waitForAllEffects()
    expect(component.getByText(/Afghanistan/)).toBeInTheDocument()
    expect(component.getByText(/Afghanistan/).closest('a')).toHaveAttribute('href', '/countries/af')
    expect(component).toMatchSnapshot()
  })

  test('Should render text without anchor for unauthorized users', async () => {
    mockSessionImplementation(false)
    const variables = { first: DEFAULT_PAGE_SIZE, search: '' }
    const mockCountryList = generateMockApolloData(COUNTRIES_LIST_QUERY, variables, null, countryListData)
    const component = render(
      <CustomMockedProvider mocks={[mockCountryList]} addTypename={false}>
        <FilterContextProvider>
          <UserFilterProvider>
            <CountryListQuery />
          </UserFilterProvider>
        </FilterContextProvider>
      </CustomMockedProvider>
    )

    await waitForAllEffects()
    expect(component.getByText(/Afghanistan/)).toBeInTheDocument()
    expect(component.getByText(/Afghanistan/).closest('a')).toBe(null)
    expect(component).toMatchSnapshot()
  })
})
