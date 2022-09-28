import { fireEvent, screen } from '@testing-library/react'
import ProductDetailSdgs from '../../../components/products/ProductDetailSdgs'
import { SDG_SEARCH_QUERY } from '../../../queries/sdg'
import { waitForAllEffectsAndSelectToLoad, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { product } from './data/ProductForm'
import { sdgs } from './data/ProductDetailSdgs'

mockNextUseRouter()
describe('Unit tests for the ProductDetailSDGs component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SDGS_SEARCH_TEST_ID = 'sdgs-search'
  const SDGS_SEARCH_OPTION_1_LABEL = 'SDGs 1'
  const SDGS_SEARCH_OPTION_2_LABEL = 'SDGs 2'
  const PRODUCT_TEST_SDGS_LABEL = 'Test SDG'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockSDGs = generateMockApolloData(SDG_SEARCH_QUERY, { search: '' }, null, sdgs)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSDGs]}>
        <ProductDetailSdgs
          canEdit={false}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSDGs]}>
        <ProductDetailSdgs
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSDGs]}>
        <ProductDetailSdgs
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSDGs]}>
        <ProductDetailSdgs
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockSDGs]}>
        <ProductDetailSdgs
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(SDGS_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SDGS_SEARCH_OPTION_1_LABEL)
    fireEvent.click(getByText(SDGS_SEARCH_OPTION_1_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(SDGS_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SDGS_SEARCH_OPTION_2_LABEL)
    fireEvent.click(getByText(SDGS_SEARCH_OPTION_2_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PRODUCT_TEST_SDGS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SDGS_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SDGS_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PRODUCT_TEST_SDGS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SDGS_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SDGS_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
