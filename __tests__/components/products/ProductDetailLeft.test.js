import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import { CANDIDATE_ROLE_QUERY } from '../../../queries/candidate'
import { COMMENTS_COUNT_QUERY } from '../../../queries/comment'
import { OWNED_PRODUCTS_QUERY } from '../../../queries/product'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { product } from './data/ProductForm'

mockNextUseRouter()
describe('Unit test for the ProductDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'
  const ownedProductData = { data: { ownedProducts: [] } }
  const mockOwnedProducts = generateMockApolloData(OWNED_PRODUCTS_QUERY, null, null, ownedProductData)

  const candidateRoleVars = {
    email: 'some-fake@email.com',
    productId: 1,
    datasetId: '',
    organizationId: ''
  }
  const candidateRoleData = { data: { candidateRole: null } }
  const mockCandidateRole = generateMockApolloData(CANDIDATE_ROLE_QUERY, candidateRoleVars, null, candidateRoleData)

  const commentVars = { commentObjectId: 1, commentObjectType:'PRODUCT' }
  const commentData = { 'data': { 'countComments': 0 } }
  const mockComment = generateMockApolloData(COMMENTS_COUNT_QUERY, commentVars, null, commentData)

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: false })

    const { queryByTestId } = render(
      <CustomMockedProvider mocks={[mockComment, mockOwnedProducts, mockCandidateRole]}>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })

    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockComment, mockOwnedProducts, mockCandidateRole]}>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to product edit form', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })

    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockComment, mockOwnedProducts, mockCandidateRole]}>
        <ProductDetailLeft product={product} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/en/products/${product.slug}/edit`)
  })
})
