import { render, waitForAllEffects } from '../../test-utils'
import ProductPricing from '../../../components/products/ProductPricing'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { commercialProduct } from './data/ProductPricing'

mockNextUseRouter()
describe('Unit test for the ProductDetailOrganizations component.', () => {
  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
  })

  test('Should render pricing data structure for commercial product.', async () => {
    const component = render(<ProductPricing product={commercialProduct} canEdit={false} />)
    await waitForAllEffects()

    // Commercial product will display pricing data etc.
    expect(component.getByText(/Hosting Model/)).toBeInTheDocument()
    expect(component.getByText(/CLOUD/)).toBeInTheDocument()

    expect(component.getByText(/Pricing Model/)).toBeInTheDocument()
    expect(component.getByText(/SUBSCRIPTION/)).toBeInTheDocument()

    expect(component.getByText(/Detail Pricing Information/)).toBeInTheDocument()

    expect(component).toMatchSnapshot()
  })
})
