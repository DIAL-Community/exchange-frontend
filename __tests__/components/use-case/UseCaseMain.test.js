import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import UseCaseMain from '../../../components/use-case/UseCaseMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_USE_CASES_QUERY
} from '../../../components/shared/query/useCase'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { UseCaseFilterProvider } from '../../../components/context/UseCaseFilterContext'
import { paginatedUseCases, useCasePaginationAttribute } from './data/UseCaseMain.data'

mockNextUseRouter()
describe('Unit tests for the use case main page.', () => {
  test('Should render list of use cases.', async () => {
    const mockUseCasePaginationAttribute = generateMockApolloData(
      USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
      { search:'', sdgs: [], showBeta: false, showGovStackOnly: false },
      null,
      useCasePaginationAttribute
    )
    const mockPaginatedUseCases = generateMockApolloData(
      PAGINATED_USE_CASES_QUERY,
      { search:'', sdgs: [], showBeta: false, showGovStackOnly: false, limit: 8, offset: 0 },
      null,
      paginatedUseCases
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedUseCases, mockUseCasePaginationAttribute]}>
        <QueryParamContextProvider>
          <UseCaseFilterProvider>
            <UseCaseMain activeTab={0} />
          </UseCaseFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Construction Permit')).toBeInTheDocument()
    expect(await screen.findByText('Extended Producer Responsibility (EPR)')).toBeInTheDocument()
    expect(await screen.findByText('Farmer-Facing Supply Chain Management')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
