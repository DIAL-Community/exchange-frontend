import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/dom'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import DatasetMain from '../../../components/dataset/DatasetMain'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import {
  DATASET_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_DATASETS_QUERY
} from '../../../components/shared/query/dataset'
import { QueryParamContextProvider } from '../../../components/context/QueryParamContext'
import { DatasetFilterProvider } from '../../../components/context/DatasetFilterContext'
import { paginatedDatasets, datasetPaginationAttribute } from './data/DatasetMain.data'

mockNextUseRouter()
describe('Unit tests for the dataset main page.', () => {
  test('Should render list of datasets.', async () => {
    const mockDatasetPaginationAttribute = generateMockApolloData(
      DATASET_PAGINATION_ATTRIBUTES_QUERY,
      { search:'', origins: [], sdgs: [], sectors: [], tags: [], datasetTypes: [] },
      null,
      datasetPaginationAttribute
    )
    const mockPaginatedDatasets = generateMockApolloData(
      PAGINATED_DATASETS_QUERY,
      { search:'', origins: [], sdgs: [], sectors: [], tags: [], datasetTypes: [], limit: 8, offset: 0 },
      null,
      paginatedDatasets
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedDatasets, mockDatasetPaginationAttribute]}>
        <QueryParamContextProvider>
          <DatasetFilterProvider>
            <DatasetMain activeTab={0} />
          </DatasetFilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Advocacy Training for Community Health Workers')).toBeInTheDocument()
    expect(await screen.findByText('African Storybook')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
