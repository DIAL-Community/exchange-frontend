import { fireEvent, screen, waitFor } from '@testing-library/react'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import ProductDetailOrganizations from '../../../components/products/ProductDetailOrganizations'
import { organizations } from './data/ProductDetailOrganizations'
import { product } from './data/ProductForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the ProductDetailOrganizations component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const ORGANIZATION_SEARCH_TEST_ID = 'organization-search'
  const ORGANIZATION_SEARCH_PLACEHOLDER = 'Type to search...'
  const ORGANIZATION_SEARCH_OPTION_LABEL = 'Another Organization'
  const PROJECT_TEST_ORGANIZATION_LABEL = 'Test Organization'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organizations)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProductDetailOrganizations
          canEdit={false}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProductDetailOrganizations
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProductDetailOrganizations
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(ORGANIZATION_SEARCH_PLACEHOLDER)
    await waitFor(() => expect(container.querySelector('.react-select__loading-indicator')).toBeNull())
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProductDetailOrganizations
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(ORGANIZATION_SEARCH_PLACEHOLDER)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProductDetailOrganizations
          canEdit={true}
          product={product}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(ORGANIZATION_SEARCH_PLACEHOLDER)

    fireEvent.keyDown(getByTestId(ORGANIZATION_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(ORGANIZATION_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(ORGANIZATION_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(ORGANIZATION_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(ORGANIZATION_SEARCH_PLACEHOLDER)

    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(ORGANIZATION_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
