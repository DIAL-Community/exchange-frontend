import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProductEdit from '../../../components/product/ProductEdit'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_PRODUCT } from '../../../components/shared/mutation/product'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  OWNED_PRODUCTS_QUERY, PAGINATED_PRODUCTS_QUERY, PRODUCT_DETAIL_QUERY, PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
  PRODUCT_POLICY_QUERY
} from '../../../components/shared/query/product'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockLexicalComponents, mockNextAuthUseSession, mockNextUseRouter, mockTenantApi
} from '../../utils/nextMockImplementation'
import { commentsQuery, createProduct, ownedProducts, productDetail } from './data/ProductDetail.data'
import { paginatedProducts, productPaginationAttribute } from './data/ProductMain.data'

mockTenantApi()
mockNextUseRouter()
mockLexicalComponents()
describe('Unit tests for the product detail page.', () => {
  const mockProductPolicies = generateMockApolloData(
    PRODUCT_POLICY_QUERY,
    { 'slug': 'xchange-graph-query-context-policies' },
    null,
    { data: { product: null } }
  )

  const mockProduct = generateMockApolloData(
    PRODUCT_DETAIL_QUERY,
    {
      'slug': 'firma'
    },
    null,
    productDetail
  )

  const mockOwnedProducts = generateMockApolloData(
    OWNED_PRODUCTS_QUERY,
    {},
    null,
    ownedProducts
  )

  const mockProductComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 190,
      'commentObjectType': 'PRODUCT'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a product.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProduct, mockOwnedProducts, mockProductPolicies, mockProductComments]}>
        <QueryParamContextProvider>
          <ProductEdit slug='firma' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unauthorized for non logged in user.', async () => {
    const graphQueryErrors = {
      graphQueryErrors: [{
        'message': 'Viewing is not allowed.',
        'locations': [
          {
            'line': 2,
            'column': 3
          }
        ],
        'path': [
          'buildingBlock'
        ],
        'extensions': {
          'code': QueryErrorCode.UNAUTHORIZED
        }
      }]
    }
    const mockProductPolicyQueryError = generateMockApolloData(
      PRODUCT_DETAIL_QUERY,
      {
        'slug': 'firma'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockProductPolicyQueryError, mockOwnedProducts, mockProductComments]}>
        <QueryParamContextProvider>
          <ProductEdit slug='firma' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_PRODUCT,
      {
        'name': '@firma - Edited',
        'slug': 'firma',
        'aliases': [
          ''
        ],
        'website': 'administracionelectronica.gob.es/ctt/clienteafirma',
        'description': `
          Suite of solutions for digital identities and electronic signatures, aimed at public
          administrations for the implementation of authentication and electronic signatures in
          a streamlined and effective manner.
        `,
        'commercialProduct': false,
        'hostingModel': null,
        'pricingModel': null,
        'pricingDetails': null,
        'govStackEntity': false,
        'productStage': null,
        'extraAttributes': []
      },
      null,
      createProduct
    )

    const mockProductPaginationAttribute = generateMockApolloData(
      PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      productPaginationAttribute
    )

    const mockPaginatedProducts = generateMockApolloData(
      PAGINATED_PRODUCTS_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedProducts
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockProduct,
          mockOwnedProducts,
          mockProductComments,
          mockCreateBuildingBlock,
          mockProductPaginationAttribute,
          mockPaginatedProducts,
          mockProduct
        ]}
      >
        <QueryParamContextProvider>
          <ProductEdit slug='firma' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('@firma')
    expect(repositoryNameInput.value).toBe('@firma')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('@firma - Edited')

    const repositorySubmitButton = screen.getByText('Submit Product')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
