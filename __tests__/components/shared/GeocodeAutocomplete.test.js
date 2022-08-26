import { fireEvent } from '@testing-library/react'
import GeocodeAutocomplete from '../../../components/shared/GeocodeAutocomplete'
import { COUNTRY_CODES_QUERY } from '../../../queries/country'
import { mockArcGisToken, mockRouterImplementation, render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { countries } from './data/GeocodeAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the GeocodeAutocomplete component.', () => {
  const TEST_ID = 'select'
  const mockOnChange = jest.fn()
  const mockCountries = generateMockApolloData(COUNTRY_CODES_QUERY, { search: '' }, null, countries)

  beforeAll(() => {
    mockArcGisToken()
    mockRouterImplementation()
  })

  test('Should match snapshot.', async () => {
    const { container, getByText } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <GeocodeAutocomplete onChange={mockOnChange} />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(getByText('Type to search...')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - search.', async () => {
    const { container, getByText, getByTestId } = render(
      <div data-testid={TEST_ID}>
        <CustomMockedProvider mocks={[mockCountries]}>
          <GeocodeAutocomplete onChange={mockOnChange} />
        </CustomMockedProvider>
      </div>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(TEST_ID).firstChild, { key: 'ArrowDown' })
    expect(getByText('Search for Location')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
