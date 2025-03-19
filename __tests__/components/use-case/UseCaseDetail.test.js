import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { SiteSettingProvider } from '../../../components/context/SiteSettingContext'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_USE_CASE } from '../../../components/shared/mutation/useCase'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import { SECTOR_SEARCH_QUERY } from '../../../components/shared/query/sector'
import { DEFAULT_SITE_SETTING_DETAIL_QUERY } from '../../../components/shared/query/siteSetting'
import {
  PAGINATED_USE_CASES_QUERY, USE_CASE_DETAIL_QUERY, USE_CASE_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/useCase'
import UseCaseEdit from '../../../components/use-case/UseCaseEdit'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockLexicalComponents, mockNextAuthUseSession, mockNextUseRouter, mockTenantApi
} from '../../utils/nextMockImplementation'
import { commentsQuery, createUseCase, sectors, siteSettings, useCaseDetail } from './data/UseCaseDetail.data'
import { paginatedUseCases, useCasePaginationAttribute } from './data/UseCaseMain.data'

mockTenantApi()
mockNextUseRouter()
mockLexicalComponents()
describe('Unit tests for the useCase detail page.', () => {
  const mockUseCase = generateMockApolloData(
    USE_CASE_DETAIL_QUERY,
    {
      'slug': 'remote-learning'
    },
    null,
    useCaseDetail
  )

  const mockSectors = generateMockApolloData(
    SECTOR_SEARCH_QUERY,
    {
      'search': '',
      'locale': 'en'
    },
    null,
    sectors
  )

  const mockUseCaseComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 190,
      'commentObjectType': 'USE_CASE'
    },
    null,
    commentsQuery
  )

  const mockSiteSetting = generateMockApolloData(
    DEFAULT_SITE_SETTING_DETAIL_QUERY,
    {},
    null,
    siteSettings
  )

  test('Should render detail of a useCase.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockUseCase, mockSiteSetting, mockUseCaseComments, mockSectors]}>
        <QueryParamContextProvider>
          <SiteSettingProvider>
            <UseCaseEdit slug='remote-learning' />
          </SiteSettingProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Remote Learning')).toBeInTheDocument()
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
    const mockUseCasePolicyQueryError = generateMockApolloData(
      USE_CASE_DETAIL_QUERY,
      {
        'slug': 'remote-learning'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockUseCasePolicyQueryError, mockSiteSetting, mockUseCaseComments, mockSectors]}>
        <QueryParamContextProvider>
          <SiteSettingProvider>
            <UseCaseEdit slug='remote-learning' />
          </SiteSettingProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_USE_CASE,
      {
        'name': 'Remote Learning - Edited',
        'slug': 'remote-learning',
        'sectorSlug': 'education-and-social-development-duplicate-0',
        'maturity': 'PUBLISHED',
        'description': 'Description for the use case.',
        'markdownUrl': null,
        'govStackEntity': false
      },
      null,
      createUseCase
    )

    const mockUseCasePaginationAttribute = generateMockApolloData(
      USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
      { search: '', locale: 'en' },
      null,
      useCasePaginationAttribute
    )

    const mockPaginatedUseCases = generateMockApolloData(
      PAGINATED_USE_CASES_QUERY,
      { search: '', locale: 'en', limit: 8, offset: 0 },
      null,
      paginatedUseCases
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockSectors,
          mockUseCase,
          mockUseCase,
          mockSiteSetting,
          mockUseCaseComments,
          mockCreateBuildingBlock,
          mockUseCasePaginationAttribute,
          mockPaginatedUseCases
        ]}
      >
        <QueryParamContextProvider>
          <SiteSettingProvider>
            <UseCaseEdit slug='remote-learning' />
          </SiteSettingProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Remote Learning')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('Remote Learning')
    expect(repositoryNameInput.value).toBe('Remote Learning')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('Remote Learning - Edited')

    const repositorySubmitButton = screen.getByText('Submit Use Case')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
