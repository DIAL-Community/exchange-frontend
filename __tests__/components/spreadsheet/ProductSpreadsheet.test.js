import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockObserverImplementation, render, waitForAllEffects } from '../../test-utils'
import { DEFAULT_SHEET_NAMES } from '../../../components/spreadsheets/ProductSpreadsheetConfig'
import ProductSpreadsheet from '../../../components/spreadsheets/ProductSpreadsheet'
import { PRODUCT_SPREADSHEET_QUERY } from '../../../queries/spreadsheet'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { mockedProductSpreadsheetData } from './data/ProductSpreadsheet'

jest.setTimeout(10000)

mockNextUseRouter()
describe('Unit tests for spreadsheet interaction.', () => {
  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
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
    await waitForAllEffects(100)
    expect(component).toMatchSnapshot()
  })

  test('Should render spreadsheet when apollo is not returning errors.', async () => {
    // Mock all apollo interaction
    const mockProductSpreadsheetData = generateMockApolloData(
      PRODUCT_SPREADSHEET_QUERY,
      {},
      null,
      mockedProductSpreadsheetData
    )
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockProductSpreadsheetData]} addTypename={false}>
        <ProductSpreadsheet />
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects(100)

    // Should render the table header.
    DEFAULT_SHEET_NAMES.map(sheetName => {
      expect(component.getByText(sheetName)).toBeInTheDocument()
    })

    // Should render the table itself
    expect(component.getByText('Product A')).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })
})
