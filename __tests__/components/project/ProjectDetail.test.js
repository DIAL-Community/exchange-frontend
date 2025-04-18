import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProjectEdit from '../../../components/project/ProjectEdit'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_PROJECT } from '../../../components/shared/mutation/project'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import { COUNTRY_CODES_QUERY } from '../../../components/shared/query/country'
import {
  PAGINATED_PROJECTS_QUERY, PROJECT_DETAIL_QUERY, PROJECT_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/project'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockLexicalComponents, mockNextAuthUseSession, mockNextUseRouter, mockTenantApi
} from '../../utils/nextMockImplementation'
import { commentsQuery, countries, createProject, projectDetail } from './data/ProjectDetail.data'
import { paginatedProjects, projectPaginationAttribute } from './data/ProjectMain.data'

mockTenantApi()
mockNextUseRouter()
mockLexicalComponents()
describe('Unit tests for the project detail page.', () => {
  const mockProject = generateMockApolloData(
    PROJECT_DETAIL_QUERY,
    {
      'slug': 'colombia-hmis'
    },
    null,
    projectDetail
  )

  const mockProjectComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 190,
      'commentObjectType': 'PROJECT'
    },
    null,
    commentsQuery
  )

  const mockProjectCountries = generateMockApolloData(
    COUNTRY_CODES_QUERY,
    { 'search': '' },
    null,
    countries
  )

  test('Should render detail of a project.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProject, mockProjectComments, mockProjectCountries]}>
        <QueryParamContextProvider>
          <ProjectEdit slug='colombia-hmis' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Colombia HMIS')).toBeInTheDocument()
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
    const mockProjectPolicyQueryError = generateMockApolloData(
      PROJECT_DETAIL_QUERY,
      {
        'slug': 'colombia-hmis'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockProjectPolicyQueryError, mockProjectComments, mockProjectCountries]}>
        <QueryParamContextProvider>
          <ProjectEdit slug='colombia-hmis' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateBuildingBlock = generateMockApolloData(
      CREATE_PROJECT,
      {
        'name': 'Colombia HMIS - Edited Again',
        'slug': 'colombia-hmis',
        'projectUrl': 'digitalhealthatlas.org/en/-/projects/1047/published',
        'description':
          '<p class="ExchangeLexicalTheme__paragraph" dir="ltr">' +
            '<span style="white-space: pre-wrap;">' +
              'eMoH implementation of DHIS2.' +
            '</span>' +
          '</p>',
        'countrySlugs': ['co']
      },
      null,
      createProject
    )

    const mockProjectPaginationAttribute = generateMockApolloData(
      PROJECT_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      projectPaginationAttribute
    )

    const mockPaginatedProjects = generateMockApolloData(
      PAGINATED_PROJECTS_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedProjects
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockProject,
          mockProjectComments,
          mockCreateBuildingBlock,
          mockProjectPaginationAttribute,
          mockPaginatedProjects,
          mockProject,
          mockProjectCountries
        ]}
      >
        <QueryParamContextProvider>
          <ProjectEdit slug='colombia-hmis' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Colombia HMIS')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('Colombia HMIS')
    expect(repositoryNameInput.value).toBe('Colombia HMIS')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('Colombia HMIS - Edited')

    await user.clear(repositoryNameInput)
    await user.type(repositoryNameInput, 'Colombia HMIS - Edited Again')
    expect(repositoryNameInput.value).toBe('Colombia HMIS - Edited Again')

    const repositorySubmitButton = screen.getByText('Submit Project')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
