import ProductDetailPlaybooks from '../../../components/products/ProductDetailPlaybooks'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { product } from './data/ProductForm'

mockNextUseRouter()
describe('Unit tests for the ProductDetailPlaybooks component.', () => {
  test('Should match snapshot', () => {
    const { container } = render(
      <ProductDetailPlaybooks
        product={product}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
