import { fireEvent, screen, waitFor } from '@testing-library/react'
import ProductDetailSectors from '../../../components/products/ProductDetailSectors'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { sectors } from './data/ProductDetailSectors'
import { product } from './data/ProductForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the ProductDetailSectors component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SECTOR_SEARCH_TEST_ID = 'sector-search'
  const SECTOR_SEARCH_PLACEHOLDER = 'Type to search...'
  const SECTOR_SEARCH_OPTION_1_LABEL = 'Sector 1'
  const SECTOR_SEARCH_OPTION_2_LABEL = 'Sector 2'
  const PRODUCT_TEST_SECTOR_LABEL = 'Test Sector'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProductDetailSectors
          canEdit={false}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProductDetailSectors
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProductDetailSectors
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )

    await waitFor(() => new Promise((res) => setTimeout(res, 0)))

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)
    await waitFor(() => expect(container.querySelector('.react-select__loading-indicator')).toBeNull())
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProductDetailSectors
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProductDetailSectors
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SECTOR_SEARCH_OPTION_1_LABEL)
    fireEvent.click(getByText(SECTOR_SEARCH_OPTION_1_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SECTOR_SEARCH_OPTION_2_LABEL)
    fireEvent.click(getByText(SECTOR_SEARCH_OPTION_2_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PRODUCT_TEST_SECTOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)

    expect(screen.queryByText(PRODUCT_TEST_SECTOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
