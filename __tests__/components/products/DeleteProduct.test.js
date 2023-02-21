import { fireEvent, waitFor } from '@testing-library/react'
import DeleteProduct from '../../../components/products/DeleteProduct'
import { DELETE_PRODUCT } from '../../../mutations/product'
import { PRODUCT_QUERY } from '../../../queries/product'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { product } from './data/ProductForm'

mockNextUseRouter()
describe('Unit tests for the DeleteProduct component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open confirmation dialog after clicking delete button.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteProduct product={product}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close confirmation dialog.', () => {
    test('after clicks "Cancel" button.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteProduct product={product} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('Should failed to execute mutation after clicking confirm button.', async () => {
      const mockFailedMutation = generateMockApolloData(
        DELETE_PRODUCT,
        { id: product.id },
        new Error('An error occurred')
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockFailedMutation]}>
          <DeleteProduct product={product} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Product record deletion failed.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })

    test('Should successfully execute mutation after clicking confirm button.', async () => {
      const mockSuccessfulMutation = generateMockApolloData(
        DELETE_PRODUCT,
        { id: product.id },
        null,
        {
          data: {
            deleteProduct: {
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug
              },
              errors: []
            }
          }
        }
      )

      const mockDetailQuery = generateMockApolloData(
        PRODUCT_QUERY,
        { slug: product.slug },
        null,
        {
          data: {
            product
          }
        }
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockDetailQuery, mockSuccessfulMutation]}>
          <DeleteProduct product={product}/>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Product record deleted successfully.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
