import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { CREATE_ORGANIZATION } from '../../../components/shared/mutation/organization'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  ORGANIZATION_DETAIL_QUERY, PAGINATED_STOREFRONTS_QUERY, STOREFRONT_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/organization'
import StorefrontEdit from '../../../components/storefront/StorefrontEdit'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { commentsQuery, createStorefront, storefrontDetail } from './data/StorefrontDetail.data'
import { paginatedStorefronts, storefrontPaginationAttribute } from './data/StorefrontMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the storefront detail page.', () => {
  const mockStorefront = generateMockApolloData(
    ORGANIZATION_DETAIL_QUERY,
    {
      'slug': 'ai4gov'
    },
    null,
    storefrontDetail
  )

  const mockStorefrontComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 190,
      'commentObjectType': 'STOREFRONT'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a storefront.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockStorefront, mockStorefrontComments]}>
        <QueryParamContextProvider>
          <StorefrontEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI4GOV')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render unauthorized for non logged in user.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockStorefront, mockStorefrontComments]}>
        <QueryParamContextProvider>
          <StorefrontEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI4GOV')).toBeInTheDocument()
    expect(await screen.findByText('You are not authorized to view this page')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_ORGANIZATION,
      {
        'name': 'AI4GOV - Edited',
        'slug': 'ai4gov',
        'aliases': [''],
        'website': 'www.ai4gov.net',
        'description': 'Description for the organization.',
        'hasStorefront': true
      },
      null,
      createStorefront
    )

    const mockStorefrontPaginationAttribute = generateMockApolloData(
      STOREFRONT_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      storefrontPaginationAttribute
    )

    const mockPaginatedStorefronts = generateMockApolloData(
      PAGINATED_STOREFRONTS_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedStorefronts
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockStorefront,
          mockStorefrontComments,
          mockCreateBuildingBlock,
          mockStorefrontPaginationAttribute,
          mockPaginatedStorefronts,
          mockStorefront
        ]}
      >
        <QueryParamContextProvider>
          <StorefrontEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI4GOV')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('AI4GOV')
    expect(repositoryNameInput.value).toBe('AI4GOV')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('AI4GOV - Edited')

    const repositorySubmitButton = screen.getByText('Submit Storefront')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
