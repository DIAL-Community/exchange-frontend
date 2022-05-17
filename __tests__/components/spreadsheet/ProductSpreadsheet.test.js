import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { waitFor } from '@testing-library/react'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render } from '../../test-utils'
import ProductSpreadsheet, { PRODUCT_SPREADSHEET_QUERY } from '../../../components/spreadsheets/ProductSpreadsheet'
import { productSpreadsheet } from './data/ProductSpreadsheet'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for playbook list interaction.', () => {
  const pushSpy = jest.fn(() => Promise.resolve(true))
  beforeEach(() => {
    // Mocked router implementation.
    useRouter.mockImplementation(() => ({
      asPath: '/',
      locale: 'en',
      push: pushSpy,
      prefetch: jest.fn(() => Promise.resolve(true)),
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }))
    // Mocked session implementation.
    const mockSession = {
      expires: '1',
      user: { email: 'a', name: 'Delta', image: 'c' },
    }
    useSession.mockReturnValue([mockSession, false])
  })

  test('Should render error message when the apollo is returning errors.', async () => {
    // Mock all apollo interaction
    const mockProductSpreadsheetData = generateMockApolloData(PRODUCT_SPREADSHEET_QUERY, {}, new Error('An error occurred'))
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockProductSpreadsheetData]} addTypename={false}>
        <ProductSpreadsheet />
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitFor(() => new Promise((res) => setTimeout(res, 0)))
    expect(component).toMatchSnapshot()
  })

  test('Should render spreadsheet when apollo is not returning errors.', async () => {
    // Mock all apollo interaction
    const mockProductSpreadsheetData = generateMockApolloData(PRODUCT_SPREADSHEET_QUERY, {}, null, productSpreadsheet)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockProductSpreadsheetData]} addTypename={false}>
        <ProductSpreadsheet />
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitFor(() => new Promise((res) => setTimeout(res, 0)))
    expect(component).toMatchSnapshot()
  })
})
