import { fireEvent, screen } from '@testing-library/react'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import BuildingBlockDetailProducts from '../../../components/building-blocks/BuildingBlockDetailProducts'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { products } from './data/BuildingBlockDetailProducts'
import { buildingBlock } from './data/BuildingBlockForm'

mockNextUseRouter()
describe('Unit test for the BuildingBlockDetailProducts component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const PRODUCT_SEARCH_TEST_ID = 'product-search'
  const PRODUCT_SEARCH_OPTION_LABEL = 'Product 2'
  const BUILDING_BLOCK_TEST_PRODUCT_LABEL = 'Product 1'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <BuildingBlockDetailProducts
          canEdit={false}
          buildingBlock={buildingBlock}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <BuildingBlockDetailProducts
          canEdit={true}
          buildingBlock={buildingBlock}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <BuildingBlockDetailProducts
          canEdit={true}
          buildingBlock={buildingBlock}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId, getAllByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <BuildingBlockDetailProducts
          canEdit={true}
          buildingBlock={buildingBlock}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    await screen.findByText(BUILDING_BLOCK_TEST_PRODUCT_LABEL)
    fireEvent.click(getAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)[0])
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(0)
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockProducts]}>
        <BuildingBlockDetailProducts
          canEdit={true}
          buildingBlock={buildingBlock}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(PRODUCT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(PRODUCT_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(PRODUCT_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(BUILDING_BLOCK_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PRODUCT_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(BUILDING_BLOCK_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PRODUCT_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
