import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { CountryAutocomplete } from '../../../../components/filter/element/Country'
import { COUNTRY_SEARCH_QUERY } from '../../../../queries/country'
import { countries } from './data/CountryAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the CountryAutocomplete component.', () => {
  const mockCountries = generateMockApolloData(COUNTRY_SEARCH_QUERY, { search: '' }, null, countries)
  const COUNTRY_SEARCH_TEST_ID = 'country-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <CountryAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <CountryAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(COUNTRY_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Country 1')
    expect(container).toHaveTextContent('Country 2')
    expect(container).toMatchSnapshot()
  })
})
