import { screen } from '@testing-library/dom'
import { FilterProvider } from '../../../components/context/FilterContext'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import {
  PAGINATED_USE_CASES_QUERY,
  USE_CASE_PAGINATION_ATTRIBUTES_QUERY
} from '../../../components/shared/query/useCase'
import UseCaseMain from '../../../components/use-case/UseCaseMain'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { paginatedUseCases, useCasePaginationAttribute } from './data/UseCaseMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the use case main page.', () => {
  test('Should render list of use cases.', async () => {
    const mockUseCasePaginationAttribute = generateMockApolloData(
      USE_CASE_PAGINATION_ATTRIBUTES_QUERY,
      { search: '', sdgs: [], showBeta: false, showGovStackOnly: false },
      null,
      useCasePaginationAttribute
    )
    const mockPaginatedUseCases = generateMockApolloData(
      PAGINATED_USE_CASES_QUERY,
      { search: '', sdgs: [], showBeta: false, showGovStackOnly: false, limit: 8, offset: 0 },
      null,
      paginatedUseCases
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedUseCases, mockUseCasePaginationAttribute]}>
        <QueryParamContextProvider>
          <FilterProvider>
            <UseCaseMain activeTab={0} />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Construction Permit')).toBeInTheDocument()
    expect(await screen.findByText('Extended Producer Responsibility (EPR)')).toBeInTheDocument()
    expect(await screen.findByText('Farmer-Facing Supply Chain Management')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
