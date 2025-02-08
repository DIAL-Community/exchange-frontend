import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_STOREFRONT } from '../../../components/shared/mutation/organization'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  PAGINATED_STOREFRONTS_QUERY, STOREFRONT_DETAIL_QUERY, STOREFRONT_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/organization'
import StorefrontEdit from '../../../components/storefront/StorefrontEdit'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockLexicalComponents, mockNextAuthUseSession, mockNextUseRouter, mockTenantApi
} from '../../utils/nextMockImplementation'
import { commentsQuery, createStorefront, storefrontDetail } from './data/StorefrontDetail.data'
import { paginatedStorefronts, storefrontPaginationAttribute } from './data/StorefrontMain.data'

mockTenantApi()
mockNextUseRouter()
mockLexicalComponents()
describe('Unit tests for the storefront detail page.', () => {
  const mockStorefront = generateMockApolloData(
    STOREFRONT_DETAIL_QUERY,
    {
      'slug': 'current-storefront'
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
          <StorefrontEdit slug='current-storefront' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Current Storefront')).toBeInTheDocument()
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
    const mockStorefrontPolicyQueryError = generateMockApolloData(
      STOREFRONT_DETAIL_QUERY,
      {
        'slug': 'current-storefront'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockStorefront, mockStorefrontPolicyQueryError, mockStorefrontComments]}>
        <QueryParamContextProvider>
          <StorefrontEdit slug='current-storefront' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_STOREFRONT,
      {
        'name': 'Current Storefront - Edited',
        'slug': 'current-storefront',
        'aliases': [''],
        'website': 'google.com',
        'description':
          '<p class="ExchangeLexicalTheme__paragraph" dir="ltr">' +
            '<span style="white-space: pre-wrap;">' +
              'Test storefront. Updating. Test.' +
            '</span>' +
          '</p>',
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
          <StorefrontEdit slug='current-storefront' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Current Storefront')).toBeInTheDocument()

    const nameInput = screen.getByDisplayValue('Current Storefront')
    expect(nameInput.value).toBe('Current Storefront')

    const user = userEvent.setup()
    await user.type(nameInput, ' - Edited')
    expect(nameInput.value).toBe('Current Storefront - Edited')

    const repositorySubmitButton = screen.getByText('Submit Storefront')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
