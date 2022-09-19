import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { product } from './data/ProductForm'

mockNextUseRouter()
describe('Unit test for the ProductDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })

    const { queryByTestId } = render(
      <CustomMockedProvider>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to product edit form', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/en/products/${product.slug}/edit`)
  })
})
