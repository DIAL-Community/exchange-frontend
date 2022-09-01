import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffects } from '../../test-utils'
import ProductPricing from '../../../components/products/ProductPricing'
import { commercialProduct } from './data/ProductPricing'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the ProductDetailOrganizations component.', () => {
  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should render pricing data structure for commercial product.', async () => {
    const component = render(<ProductPricing product={commercialProduct} canEdit={false} />)
    await waitForAllEffects(500)

    // Commercial product will display pricing data etc.
    expect(component.getByText(/Hosting Model/)).toBeInTheDocument()
    expect(component.getByText(/CLOUD/)).toBeInTheDocument()

    expect(component.getByText(/Pricing Model/)).toBeInTheDocument()
    expect(component.getByText(/SUBSCRIPTION/)).toBeInTheDocument()

    expect(component.getByText(/Detail Pricing Information/)).toBeInTheDocument()
    expect(component.getByText(/Detail info on pricing./)).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })
})
