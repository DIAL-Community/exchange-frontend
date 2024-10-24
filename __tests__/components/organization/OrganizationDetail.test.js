import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import OrganizationEdit from '../../../components/organization/OrganizationEdit'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_ORGANIZATION } from '../../../components/shared/mutation/organization'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  ORGANIZATION_DETAIL_QUERY, ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_ORGANIZATIONS_QUERY
} from '../../../components/shared/query/organization'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { commentsQuery, createOrganization, organizationDetail } from './data/OrganizationDetail.data'
import { organizationPaginationAttribute, paginatedOrganizations } from './data/OrganizationMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the organization detail page.', () => {
  const mockOrganization = generateMockApolloData(
    ORGANIZATION_DETAIL_QUERY,
    {
      'slug': 'ai4gov'
    },
    null,
    organizationDetail
  )

  const mockOrganizationComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 190,
      'commentObjectType': 'ORGANIZATION'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a organization.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganization, mockOrganizationComments]}>
        <QueryParamContextProvider>
          <OrganizationEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI4GOV')).toBeInTheDocument()
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
    const mockOrganizationPolicyQueryError = generateMockApolloData(
      ORGANIZATION_DETAIL_QUERY,
      {
        'slug': 'ai4gov'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizationPolicyQueryError, mockOrganizationComments]}>
        <QueryParamContextProvider>
          <OrganizationEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_ORGANIZATION,
      {
        'name': 'AI4GOV - Edited',
        'slug': 'ai4gov',
        'aliases': [
          ''
        ],
        'website': 'www.ai4gov.net',
        'isEndorser': true,
        'whenEndorsed': null,
        'endorserLevel': 'none',
        'isMni': false,
        'description': 'Description for the organization.',
        'hasStorefront': false
      },
      null,
      createOrganization
    )

    const mockOrganizationPaginationAttribute = generateMockApolloData(
      ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      organizationPaginationAttribute
    )

    const mockPaginatedOrganizations = generateMockApolloData(
      PAGINATED_ORGANIZATIONS_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedOrganizations
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockOrganization,
          mockOrganizationComments,
          mockCreateBuildingBlock,
          mockOrganizationPaginationAttribute,
          mockPaginatedOrganizations,
          mockOrganization
        ]}
      >
        <QueryParamContextProvider>
          <OrganizationEdit slug='ai4gov' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI4GOV')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('AI4GOV')
    expect(repositoryNameInput.value).toBe('AI4GOV')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('AI4GOV - Edited')

    const repositorySubmitButton = screen.getByText('Submit Organization')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
