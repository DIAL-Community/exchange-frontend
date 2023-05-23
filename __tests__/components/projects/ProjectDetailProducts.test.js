import { fireEvent, screen } from '@testing-library/react'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import ProjectDetailProducts from '../../../components/projects/ProjectDetailProduct'
import { OWNED_PRODUCTS_QUERY, PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { productOwnerUserProps, products, ownedProducts, projectProducts } from './data/ProjectDetailProducts'

mockNextUseRouter()
describe('Unit test for the ProjectDetailProducts component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const PRODUCT_SEARCH_TEST_ID = 'product-search'
  const PRODUCT_SEARCH_OPTION_LABEL = 'Product 2'
  const PROJECT_TEST_PRODUCT_LABEL = 'Product 1'
  const PROJECT_TEST_PRODUCT_OWNED_LABEL = 'Product 3'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)
  const mockOwnedProducts = generateMockApolloData(OWNED_PRODUCTS_QUERY, null, null, ownedProducts)

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts, mockOwnedProducts]}>
        <ProjectDetailProducts
          canEdit={false}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts, mockOwnedProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts, mockOwnedProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId, getAllByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts, mockOwnedProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    await screen.findByText(PROJECT_TEST_PRODUCT_LABEL)
    fireEvent.click(getAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)[0])
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockProducts, mockOwnedProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(PRODUCT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(PRODUCT_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(PRODUCT_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_PRODUCT_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PRODUCT_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PROJECT_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_PRODUCT_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PRODUCT_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
  })

  test('Should render Products with read only owned product pill', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { ...productOwnerUserProps, isAdminUser: false })
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts, mockProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PROJECT_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_PRODUCT_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(screen.queryAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)).toHaveLength(1)
    expect(container).toMatchSnapshot()

  })

  test('Should add a owned product pill and allow to remove', async () => {
    mockNextAuthUseSession(false, productOwnerUserProps)
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockOwnedProducts, mockProducts]}>
        <ProjectDetailProducts
          canEdit={true}
          project={projectProducts}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(PRODUCT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(PRODUCT_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(PRODUCT_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(screen.queryByText(PROJECT_TEST_PRODUCT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_PRODUCT_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)
    expect(screen.queryAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)).toHaveLength(3)
    expect(container).toMatchSnapshot()
  })
})
