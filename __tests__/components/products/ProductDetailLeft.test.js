import { DiscourseProvider } from '../../../components/context/DiscourseContext'
import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { product } from './data/ProductForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the ProductDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockSessionImplementation()

    const { queryByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProductDetailLeft product={product} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )
    
    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockSessionImplementation(true)

    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProductDetailLeft product={product} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )
    
    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to product edit form', () => {
    mockSessionImplementation(true)

    const { getByTestId } = render(
      <CustomMockedProvider>
        <DiscourseProvider>
          <ProductDetailLeft product={product} />
        </DiscourseProvider>
      </CustomMockedProvider>
    )
    
    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/en/products/${product.slug}/edit`)
  })
})
