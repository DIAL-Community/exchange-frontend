import { act } from 'react'
import { screen } from '@testing-library/dom'
import { ProjectFilterProvider } from '../../../components/context/ProjectFilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import ProjectMain from '../../../components/project/ProjectMain'
import { PAGINATED_PROJECTS_QUERY, PROJECT_PAGINATION_ATTRIBUTES_QUERY } from '../../../components/shared/query/project'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { paginatedProjects, projectPaginationAttribute } from './data/ProjectMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the project main page.', () => {
  test('Should render list of projects.', async () => {
    const mockProjectPaginationAttribute = generateMockApolloData(
      PROJECT_PAGINATION_ATTRIBUTES_QUERY,
      {
        search: '',
        countries: [],
        products: [],
        organizations: [],
        sectors: [],
        tags: [],
        sdgs: [],
        origins: []
      },
      null,
      projectPaginationAttribute
    )
    const mockPaginatedProjects = generateMockApolloData(
      PAGINATED_PROJECTS_QUERY,
      {
        search: '',
        countries: [],
        products: [],
        organizations: [],
        sectors: [],
        tags: [],
        sdgs: [],
        origins: [],
        limit: 8,
        offset: 0
      },
      null,
      paginatedProjects
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedProjects, mockProjectPaginationAttribute]}>
        <QueryParamContextProvider>
          <ProjectFilterProvider>
            <ProjectMain activeTab={0} />
          </ProjectFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('HelloMAMA')).toBeInTheDocument()
    expect(await screen.findByText('Hoji Mobile Data Collection and Analysis Platform')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
