import { fireEvent } from '@testing-library/dom'
import {
  mockRouterImplementation,
  render,
  waitForAllEffectsAndSelectToLoad
} from '../../../test-utils'
import CustomMockedProvider from '../../../utils/CustomMockedProvider'
import { DatasetTypeSelect } from '../../../../components/filter/element/DatasetType'
import { datasetTypes } from './data/DatasetTypeSelect'

jest.mock('next/dist/client/router')

describe('Unit test for the DatasetTypeSelect component.', () => {
  const DATASET_SEARCH_TEST_ID = 'dataset-search'

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot', async () => {
    const { container } = render(
      <CustomMockedProvider>
        <DatasetTypeSelect
          datasetTypes={datasetTypes}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should render a drop down with list.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <DatasetTypeSelect
          datasetTypes={datasetTypes}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.keyDown(getByTestId(DATASET_SEARCH_TEST_ID).childNodes[0], { key: 'ArrowDown' })
    
    expect(container).toHaveTextContent('Dataset')
    expect(container).toHaveTextContent('Content')
    expect(container).toMatchSnapshot()
  })
})
