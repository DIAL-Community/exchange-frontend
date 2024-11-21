import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import OpportunityDetail from '../../../components/opportunity/OpportunityDetail'
import OpportunityEdit from '../../../components/opportunity/OpportunityEdit'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_OPPORTUNITY } from '../../../components/shared/mutation/opportunity'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  OPPORTUNITY_DETAIL_QUERY, OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY, OPPORTUNITY_POLICY_QUERY,
  PAGINATED_OPPORTUNITIES_QUERY
} from '../../../components/shared/query/opportunity'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, mockTenantApi } from '../../utils/nextMockImplementation'
import { commentsQuery, createOpportunity, opportunityDetail } from './data/OpportunityDetail.data'
import { opportunityPaginationAttribute, paginatedOpportunities } from './data/OpportunityMain.data'

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the opportunity detail page.', () => {
  const mockOpportunityPolicies = generateMockApolloData(
    OPPORTUNITY_POLICY_QUERY,
    { 'slug': 'xchange-graph-query-context-policies' },
    null,
    { data: { opportunity: null } }
  )

  const mockOpportunity = generateMockApolloData(
    OPPORTUNITY_DETAIL_QUERY,
    {
      'slug': 'market-entry-in-north-macedonia'
    },
    null,
    opportunityDetail
  )

  const mockOpportunityComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 29,
      'commentObjectType': 'OPPORTUNITY'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a opportunity.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockOpportunity,
          mockOpportunityPolicies,
          mockOpportunityComments
        ]}
      >
        <QueryParamContextProvider>
          <OpportunityDetail slug='market-entry-in-north-macedonia' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Market entry in North Macedonia')).toBeInTheDocument()
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
    const mockOpportunityPolicyQueryError = generateMockApolloData(
      OPPORTUNITY_DETAIL_QUERY,
      {
        'slug': 'market-entry-in-north-macedonia'
      },
      graphQueryErrors,
      null
    )
    const { container } = render(
      <CustomMockedProvider mocks={[mockOpportunityPolicyQueryError, mockOpportunityComments]}>
        <QueryParamContextProvider>
          <OpportunityEdit slug='market-entry-in-north-macedonia' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render edit page for logged in user.', async () => {
    mockNextAuthUseSession()

    const mockCreateOpportunity = generateMockApolloData(
      CREATE_OPPORTUNITY,
      {
        'name': 'Market entry in North Macedonia - Edited',
        'slug': 'market-entry-in-north-macedonia',
        'webAddress': 'app.leverist.de/en/opportunities/market-entry-in-north-macedonia',
        'description': 'Description for the opportunity',
        'contactName': 'N/A',
        'contactEmail': 'N/A',
        'openingDate': '2024-05-03',
        'closingDate': '2024-05-04',
        'opportunityType': 'OTHER',
        'opportunityStatus': 'OPEN',
        'opportunityOrigin': 'giz',
        'govStackEntity': false
      },
      null,
      createOpportunity
    )

    const mockOpportunityPaginationAttribute = generateMockApolloData(
      OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      opportunityPaginationAttribute
    )

    const mockPaginatedOpportunities = generateMockApolloData(
      PAGINATED_OPPORTUNITIES_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedOpportunities
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockOpportunity,
          mockOpportunityComments,
          mockCreateOpportunity,
          mockOpportunityPaginationAttribute,
          mockPaginatedOpportunities,
          mockOpportunity
        ]}
      >
        <QueryParamContextProvider>
          <OpportunityEdit slug='market-entry-in-north-macedonia' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('Market entry in North Macedonia')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('Market entry in North Macedonia')
    expect(repositoryNameInput.value).toBe('Market entry in North Macedonia')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('Market entry in North Macedonia - Edited')

    const repositorySubmitButton = screen.getByText('Submit RFP')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
