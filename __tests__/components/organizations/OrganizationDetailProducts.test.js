import { fireEvent, screen } from '@testing-library/react'
import OrganizationDetailProducts from '../../../components/organizations/OrganizationDetailProducts'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { products } from './data/OrganizationDetailProducts'
import { organization } from './data/OrganizationForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the OrganizationDetailProducts component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const PRODUCT_SEARCH_TEST_ID = 'product-search'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <OrganizationDetailProducts
          canEdit={false}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <OrganizationDetailProducts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <OrganizationDetailProducts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <OrganizationDetailProducts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockProducts]} addTypename={false}>
        <OrganizationDetailProducts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    fireEvent.keyDown(getByTestId(PRODUCT_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText('Another Product')
    fireEvent.click(getByText('Another Product'))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText('Test Product')).toBeInTheDocument()
    expect(screen.queryByText('Another Product')).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    expect(screen.queryByText('Test Product')).toBeInTheDocument()
    expect(screen.queryByText('Another Product')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})