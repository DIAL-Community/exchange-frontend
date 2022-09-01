import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects } from '../../test-utils'
import { DEFAULT_SHEET_NAMES } from '../../../components/spreadsheets/ProductSpreadsheetConfig'
import ProductSpreadsheet from '../../../components/spreadsheets/ProductSpreadsheet'
import { PRODUCT_SPREADSHEET_QUERY } from '../../../queries/spreadsheet'
import { mockedProductSpreadsheetData } from './data/ProductSpreadsheet'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')
jest.setTimeout(10000)

describe('Unit tests for spreadsheet interaction.', () => {
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
    await waitForAllEffects()
    expect(component).toMatchSnapshot()
  })

  test('Should render spreadsheet when apollo is not returning errors.', async () => {
    // Mock all apollo interaction
    const mockProductSpreadsheetData = generateMockApolloData(PRODUCT_SPREADSHEET_QUERY, {}, null, mockedProductSpreadsheetData)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockProductSpreadsheetData]} addTypename={false}>
        <ProductSpreadsheet />
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects(500)

    // Should render the table header.
    DEFAULT_SHEET_NAMES.map(sheetName => {
      expect(component.getByText(sheetName)).toBeInTheDocument()
    })

    // Should render the table itself
    expect(component.getByText('Product A')).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })
})
