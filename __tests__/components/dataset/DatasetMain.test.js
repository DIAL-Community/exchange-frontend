import { act } from 'react';
import { screen } from '@testing-library/dom';
import { FilterProvider } from '../../../components/context/FilterContext';
import {
  QueryParamContextProvider,
} from '../../../components/context/QueryParamContext';
import DatasetMain from '../../../components/dataset/DatasetMain';
import {
  DATASET_PAGINATION_ATTRIBUTES_QUERY, PAGINATED_DATASETS_QUERY,
} from '../../../components/shared/query/dataset';
import { render } from '../../test-utils';
import CustomMockedProvider, {
  generateMockApolloData,
} from '../../utils/CustomMockedProvider';
import {
  mockNextUseRouter, mockTenantApi,
} from '../../utils/nextMockImplementation';
import {
  datasetPaginationAttribute, paginatedDatasets,
} from './data/DatasetMain.data';

mockTenantApi()
mockNextUseRouter()
describe('Unit tests for the dataset main page.', () => {
  test('Should render list of datasets.', async () => {
    const mockDatasetPaginationAttribute = generateMockApolloData(
      DATASET_PAGINATION_ATTRIBUTES_QUERY,
      { search: '', origins: [], sdgs: [], sectors: [], tags: [], datasetTypes: [], countries: [] },
      null,
      datasetPaginationAttribute
    )
    const mockPaginatedDatasets = generateMockApolloData(
      PAGINATED_DATASETS_QUERY,
      { search: '', origins: [], sdgs: [], sectors: [], tags: [], datasetTypes: [], countries: [], limit: 8, offset: 0 },
      null,
      paginatedDatasets
    )

    const { container } = render(
      <CustomMockedProvider mocks={[mockPaginatedDatasets, mockDatasetPaginationAttribute]}>
        <QueryParamContextProvider>
          <FilterProvider>
            <DatasetMain activeTab={0} />
          </FilterProvider>
        </QueryParamContextProvider>
      </CustomMockedProvider>
    )

    await act(() => new Promise((resolve) => setTimeout(resolve, 30)))

    expect(await screen.findByText('Advocacy Training for Community Health Workers')).toBeInTheDocument()
    expect(await screen.findByText('African Storybook')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
