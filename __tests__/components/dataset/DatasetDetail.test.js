import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import DatasetDetail from '../../../components/dataset/DatasetDetail'
import DatasetEdit from '../../../components/dataset/DatasetEdit'
import { QueryErrorCode } from '../../../components/shared/GraphQueryHandler'
import { CREATE_DATASET } from '../../../components/shared/mutation/dataset'
import { COMMENTS_QUERY } from '../../../components/shared/query/comment'
import {
  DATASET_DETAIL_QUERY, DATASET_PAGINATION_ATTRIBUTES_QUERY, DATASET_POLICY_QUERY, PAGINATED_DATASETS_QUERY
} from '../../../components/shared/query/dataset'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  mockLexicalComponents, mockNextAuthUseSession, mockNextUseRouter, mockTenantApi
} from '../../utils/nextMockImplementation'
import { commentsQuery, createDataset, datasetDetail } from './data/DatasetDetail.data'
import { datasetPaginationAttribute, paginatedDatasets } from './data/DatasetMain.data'

mockTenantApi()
mockNextUseRouter()
mockLexicalComponents()
describe('Unit tests for the dataset detail page.', () => {
  const mockDatasetPolicies = generateMockApolloData(
    DATASET_POLICY_QUERY,
    { 'slug': 'xchange-graph-query-context-policies' },
    null,
    { data: { dataset: null } }
  )

  const mockDataset = generateMockApolloData(
    DATASET_DETAIL_QUERY,
    { 'slug': 'ai-agro' },
    null,
    datasetDetail
  )

  const mockDatasetComments = generateMockApolloData(
    COMMENTS_QUERY,
    {
      'commentObjectId': 61,
      'commentObjectType': 'OPEN_DATA'
    },
    null,
    commentsQuery
  )

  test('Should render detail of a dataset.', async () => {
    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockDatasetPolicies,
          mockDatasetPolicies,
          mockDataset,
          mockDatasetComments
        ]}
      >
        <QueryParamContextProvider>
          <DatasetDetail slug='ai-agro' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI Agro')).toBeInTheDocument()
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

    const mockDatasetPolicyQueryError = generateMockApolloData(
      DATASET_DETAIL_QUERY,
      { 'slug': 'ai-agro' },
      graphQueryErrors,
      null
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockDatasetPolicyQueryError, mockDatasetComments]}>
        <QueryParamContextProvider>
          <DatasetEdit slug='ai-agro' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  mockNextAuthUseSession()
  test('Should render edit page for logged in user.', async () => {
    const mockCreateDataset = generateMockApolloData(
      CREATE_DATASET,
      {
        'name': 'AI Agro - Edited',
        'slug': 'ai-agro',
        'aliases': [
          ''
        ],
        'website': 'rentadrone.cl/developers/ai-agro',
        'visualizationUrl': '',
        'geographicCoverage': null,
        'timeRange': null,
        'datasetType': 'ai_model',
        'license': 'GPL-3.0',
        'languages': null,
        'dataFormat': null,
        'description':
          '<p class="ExchangeLexicalTheme__paragraph" dir="ltr">' +
            '<span style="white-space: pre-wrap;">' +
              'Dataset description' +
            '</span>' +
          '</p>'
      },
      null,
      createDataset
    )

    const mockDatasetPaginationAttribute = generateMockApolloData(
      DATASET_PAGINATION_ATTRIBUTES_QUERY,
      { search: '' },
      null,
      datasetPaginationAttribute
    )

    const mockPaginatedDatasets = generateMockApolloData(
      PAGINATED_DATASETS_QUERY,
      { search: '', limit: 8, offset: 0 },
      null,
      paginatedDatasets
    )

    const { container } = render(
      <CustomMockedProvider
        mocks={[
          mockDataset,
          mockDataset,
          mockCreateDataset,
          mockDatasetComments,
          mockPaginatedDatasets,
          mockDatasetPaginationAttribute
        ]}
      >
        <QueryParamContextProvider>
          <DatasetEdit slug='ai-agro' />
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    expect(await screen.findByText('AI Agro')).toBeInTheDocument()

    const repositoryNameInput = screen.getByDisplayValue('AI Agro')
    expect(repositoryNameInput.value).toBe('AI Agro')

    const user = userEvent.setup()
    await user.type(repositoryNameInput, ' - Edited')
    expect(repositoryNameInput.value).toBe('AI Agro - Edited')

    const repositorySubmitButton = screen.getByText('Submit Dataset')
    await user.click(repositorySubmitButton)

    expect(container).toMatchSnapshot()
  })
})
