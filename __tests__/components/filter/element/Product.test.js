import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { ProductAutocomplete } from '../../../../components/filter/element/Product'
import { PRODUCT_SEARCH_QUERY } from '../../../../queries/product'
import { products } from './data/ProductAutocomplete'

jest.mock('next/dist/client/router')

describe('Unit test for the ProductAutocomplete component.', () => {
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)
  const PRODUCTS_SEARCH_TEST_ID = 'product-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <ProductAutocomplete
          products={products}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <ProductAutocomplete />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(PRODUCTS_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })

    expect(container).toHaveTextContent('Another Product')
    expect(container).toMatchSnapshot()
  })
})
