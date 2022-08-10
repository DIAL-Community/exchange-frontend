import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffects } from '../../test-utils'
import CountryDetail from '../../../components/countries/CountryDetail'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { COUNTRY_DETAIL_QUERY } from '../../../queries/country'
import { country, countryWithMissingLatLong } from './data/CountryDetail'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the CountryDetail component', () => {
  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation(true)
  })

  test('should render element of the country data.', async () => {
    const variables = { slug: 'ke' }
    const mockedCountry = generateMockApolloData(
      COUNTRY_DETAIL_QUERY,
      variables,
      null,
      country
    )
    const component = render(
      <CustomMockedProvider mocks={[mockedCountry]} addTypename={false}>
        <CountryDetail country={country} />
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    // Matcher will match KE and KEN.
    expect(component.getAllByText(/KE/).length).toBe(2)
    // Matcher will match KEN only.
    expect(component.getAllByText(/KEN/).length).toBe(1)
    expect(component.getByText(/Kenya/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('should render element of the country data with missing location.', async () => {
    const variables = { slug: 'in' }
    const mockedCountry = generateMockApolloData(
      COUNTRY_DETAIL_QUERY,
      variables,
      null,
      countryWithMissingLatLong
    )
    const component = render(
      <CustomMockedProvider mocks={[mockedCountry]} addTypename={false}>
        <CountryDetail country={countryWithMissingLatLong} />
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    // Matcher will match IN and IND.
    expect(component.getAllByText(/IN/).length).toBe(2)
    // Matcher will match IND only.
    expect(component.getAllByText(/IND/).length).toBe(1)
    expect(component.getByText(/India/)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })

  test('should not render delete for user that without edit privilege.', async () => {
    mockSessionImplementation()
    const variables = { slug: 'ke' }
    const mockedCountry = generateMockApolloData(
      COUNTRY_DETAIL_QUERY,
      variables,
      null,
      country
    )
    const component = render(
      <CustomMockedProvider mocks={[mockedCountry]} addTypename={false}>
        <CountryDetail country={country} />
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    expect(component.queryByText(/Delete/)).not.toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
