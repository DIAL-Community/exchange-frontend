import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ProductFilterProvider } from '../../../components/context/ProductFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProductRepositoryDetail from '../../../components/product/repository/ProductRepositoryDetail'
import ProductRepositoryEdit from '../../../components/product/repository/ProductRepositoryEdit'
import { CREATE_PRODUCT_REPOSITORY } from '../../../components/shared/mutation/productRepository'
import { OWNED_PRODUCTS_QUERY } from '../../../components/shared/query/product'
import {
  PRODUCT_REPOSITORIES_QUERY, PRODUCT_REPOSITORY_DETAIL_QUERY
} from '../../../components/shared/query/productRepository'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import {
  createProductRepository, ownedProducts, productRepositories, productRepositoryDetail
} from './data/ProductRepositoryDetail.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the product main page.', () => {
  const mockProductRepositoryDetail = generateMockApolloData(
    PRODUCT_REPOSITORY_DETAIL_QUERY,
    {
      'productSlug': 'firma',
      'repositorySlug': 'firma-repository'
    },
    null,
    productRepositoryDetail
  )

  const mockOwnedProducts = generateMockApolloData(
    OWNED_PRODUCTS_QUERY,
    {},
    null,
    ownedProducts
  )

  const mockProductRepositories = generateMockApolloData(
    PRODUCT_REPOSITORIES_QUERY,
    { 'productSlug': 'firma' },
    null,
    productRepositories
  )

  test('Should render the product repository page.', async () => {

    const { container } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts, mockProductRepositories, mockProductRepositoryDetail]}>
        <QueryParamContextProvider>
          <ProductFilterProvider>
            <ProductRepositoryDetail productSlug={'firma'} repositorySlug={'firma-repository'} />
          </ProductFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(await screen.findByText('Repository of @firma.')).toBeInTheDocument()
    expect(await screen.findByText('administracionelectronica.gob.es/ctt/clienteafirma')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unauthorized to edit repository.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts, mockProductRepositories, mockProductRepositoryDetail]}>
        <QueryParamContextProvider>
          <ProductFilterProvider>
            <ProductRepositoryEdit productSlug={'firma'} repositorySlug={'firma-repository'} />
          </ProductFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(await screen.findByText('You are not authorized to view this page')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render the product repository edit page.', async () => {
    // Set auth value, mock that user is authenticated
    mockNextAuthUseSession()

    const mockCreateProductRepository = generateMockApolloData(
      CREATE_PRODUCT_REPOSITORY,
      {
        'productSlug':'firma',
        'name':'@firma Repository Information',
        'slug':'firma-repository',
        'absoluteUrl':'github.com/ctt-gob-es/clienteafirma',
        'description':'Repository of @firma.',
        'mainRepository':true
      },
      null,
      createProductRepository
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockOwnedProducts,
          mockProductRepositories,
          mockProductRepositoryDetail,
          mockCreateProductRepository
        ]}
      >
        <QueryParamContextProvider>
          <ProductFilterProvider>
            <ProductRepositoryEdit productSlug={'firma'} repositorySlug={'firma-repository'} />
          </ProductFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('@firma')).toBeInTheDocument()
    expect(await screen.findByText('administracionelectronica.gob.es/ctt/clienteafirma')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('@firma Repository')
    expect(repositoryNameInput.value).toBe('@firma Repository')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' Information')
    expect(repositoryNameInput.value).toBe('@firma Repository Information')

    const repositorySubmitButton = screen.getByText('Submit Product')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
