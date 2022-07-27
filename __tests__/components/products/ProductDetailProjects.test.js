import { fireEvent, screen } from '@testing-library/react'
import ProductDetailProjects from '../../../components/products/ProductDetailProjects'
import { PROJECT_SEARCH_QUERY } from '../../../queries/project'
import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { projects } from './data/ProductDetailProjects'
import { product } from './data/ProductForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for the ProductDetailProjects component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const PROJECT_SEARCH_TEST_ID = 'project-search'
  const PROJECT_SEARCH_OPTION_1_LABEL = 'Project 1'
  const PROJECT_SEARCH_OPTION_2_LABEL = 'Project 2'
  const PRODUCT_TEST_PROJECT_LABEL = 'Test Project'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockProjects = generateMockApolloData(PROJECT_SEARCH_QUERY, { search: '' }, null, projects)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProjects]}>
        <ProductDetailProjects
          canEdit={false}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProjects]}>
        <ProductDetailProjects
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProjects]}>
        <ProductDetailProjects
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
      <CustomMockedProvider mocks={[mockProjects]}>
        <ProductDetailProjects
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
      <CustomMockedProvider mocks={[mockProjects]}>
        <ProductDetailProjects
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(PROJECT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(PROJECT_SEARCH_OPTION_1_LABEL)
    fireEvent.click(getByText(PROJECT_SEARCH_OPTION_1_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(PROJECT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(PROJECT_SEARCH_OPTION_2_LABEL)
    fireEvent.click(getByText(PROJECT_SEARCH_OPTION_2_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PRODUCT_TEST_PROJECT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(PROJECT_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PRODUCT_TEST_PROJECT_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(PROJECT_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
