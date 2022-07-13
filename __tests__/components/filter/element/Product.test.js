import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { ProductAutocomplete } from '../../../../components/filter/element/Product'
import { PRODUCT_SEARCH_QUERY } from '../../../../queries/product'
import { products } from './data/ProductAutocomplete'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the ProductAutocomplete component.', () => {
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - with edit permission.', async () => {
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
})
