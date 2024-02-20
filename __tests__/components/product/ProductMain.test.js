import { screen } from '@testing-library/dom'
import { ProductFilterProvider } from '../../../components/context/ProductFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProductMain from '../../../components/product/ProductMain'
import { PAGINATED_PRODUCTS_QUERY, PRODUCT_PAGINATION_ATTRIBUTES_QUERY } from '../../../components/shared/query/product'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { paginatedProducts, productPaginationAttribute } from './data/ProductMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the product main page.', () => {
  test('Should render list of products.', async () => {
    const mockProductPaginationAttribute = generateMockApolloData(
      PRODUCT_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        useCases: [],
        buildingBlocks: [],
        sectors: [],
        tags: [],
        countries: [],
        licenseTypes: [],
        sdgs: [],
        workflows: [],
        origins: [],
        isLinkedWithDpi: false,
        showGovStackOnly: false,
        showDpgaOnly: false
      },
      null,
      productPaginationAttribute
    )
    const mockPaginatedProducts = generateMockApolloData(
      PAGINATED_PRODUCTS_QUERY,
      {
        search: '',
        useCases: [],
        buildingBlocks: [],
        sectors: [],
        tags: [],
        countries: [],
        licenseTypes: [],
        sdgs: [],
        workflows: [],
        origins: [],
        isLinkedWithDpi: false,
        showGovStackOnly: false,
        showDpgaOnly: false,
        limit: 8,
        offset: 0
      },
      null,
      paginatedProducts
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedProducts, mockProductPaginationAttribute]}>
        <QueryParamContextProvider>
          <ProductFilterProvider>
            <ProductMain activeTab={0} />
          </ProductFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AP Latam')).toBeInTheDocument()
    expect(await screen.findByText('AIDR')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
