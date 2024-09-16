import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProductEdit from '../../../components/product/ProductEdit'
import { CREATE_PRODUCT } from '../../../components/shared/mutation/product'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  OWNED_PRODUCTS_QUERY, PAGINATED_PRODUCTS_QUERY, PRODUCT_DETAIL_QUERY, PRODUCT_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/product'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { commentsQuery, createProduct, ownedProducts, productDetail } from './data/ProductDetail.data'
import { paginatedProducts, productPaginationAttribute } from './data/ProductMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the product detail page.', () => {
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
      <CustomMockedProvider mocks={[mockProduct, mockOwnedProducts, mockProductComments]}>
        <QueryParamContextProvider>
          <ProductEdit slug='firma' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unauthorized for non logged in user.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProduct, mockOwnedProducts, mockProductComments]}>
        <QueryParamContextProvider>
          <ProductEdit slug='firma' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(await screen.findByText('You are not authorized to view this page')).toBeInTheDocument()
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
        'website': 'example.com',
        'description': `
          Suite of solutions for digital identities and electronic signatures,
          aimed at public administrations for the implementation of authentication
          and electronic signatures in a streamlined and effective manner.
        `,
        'commercialProduct': false,
        'hostingModel': null,
        'pricingModel': null,
        'pricingDetails': null,
        'govStackEntity': false,
        'productStage': null,
        'extraAttributes': {}
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
