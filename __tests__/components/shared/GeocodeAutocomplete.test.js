
import { fireEvent } from '@testing-library/react'
import GeocodeAutocomplete from '../../../components/shared/GeocodeAutocomplete'
import { mockRouterImplementation, render, waitForReactSelectToLoad } from '../../test-utils'

jest.mock('next/dist/client/router')

describe('Unit test for the GeocodeAutocomplete component.', () => {
  const TEST_ID = 'select'
  const mockOnChange = jest.fn()
    
  beforeAll(() => {
    fetch.mockResponse(JSON.stringify({ token: 'test-token' }))
    mockRouterImplementation()
  })

  test('Should match snapshot.', async () => {
    const { container, getByText } = render(
      <GeocodeAutocomplete onChange={mockOnChange} />
    )
    await waitForReactSelectToLoad(container)
    expect(getByText('Enter location')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - search.', async () => {
    const { container, getByText, getByTestId } = render(
      <div data-testid={TEST_ID}>
        <GeocodeAutocomplete onChange={mockOnChange} />
      </div>
    )
    await waitForReactSelectToLoad(container)
    fireEvent.keyDown(getByTestId(TEST_ID).firstChild, { key: 'ArrowDown' })      
    expect(getByText('Search for Location')).toBeInTheDocument()  
    expect(container).toMatchSnapshot()
  })
})
