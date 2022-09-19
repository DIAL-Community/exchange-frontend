import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import GeocodeAutocomplete from '../../../components/shared/GeocodeAutocomplete'
import { COUNTRY_CODES_QUERY } from '../../../queries/country'
import { mockArcGisToken, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { countries } from './data/GeocodeAutocomplete'

mockNextUseRouter()
describe('Unit test for the GeocodeAutocomplete component.', () => {
  const TEST_ID = 'select'
  const mockOnChange = jest.fn()
  const mockCountries = generateMockApolloData(COUNTRY_CODES_QUERY, { search: '' }, null, countries)

  beforeAll(() => {
    mockArcGisToken()
  })

  test('Should match snapshot.', async () => {
    const { container, getByText } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <GeocodeAutocomplete onChange={mockOnChange} />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(getByText('Type to search...')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - search.', async () => {
    const { getByText, getByTestId } = render(
      <div data-testid={TEST_ID}>
        <CustomMockedProvider mocks={[mockCountries]}>
          <GeocodeAutocomplete onChange={mockOnChange} />
        </CustomMockedProvider>
      </div>
    )
    await waitForAllEffects()
    await act(() => fireEvent.keyDown(getByTestId(TEST_ID).firstChild, { key: 'ArrowDown' }))
    expect(getByText('Search for Location')).toBeInTheDocument()
  })
})
