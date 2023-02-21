import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import ProductForm from '../../../components/products/ProductForm'
import { CREATE_PRODUCT } from '../../../mutations/product'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { createProductFailure, createProductSuccess, product } from './data/ProductForm'

mockNextUseRouter()
describe('Unit tests for the ProductForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const PRODUCT_NAME_TEST_ID = 'product-name'
  const PRODUCT_DESCRIPTION_TEST_ID = 'product-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should match snapshot - create.', () => {
    const { container } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - edit.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container } = render(
      <CustomMockedProvider>
        <ProductForm product={product} />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Name/), 'test product name')
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PRODUCT_DESCRIPTION_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test product name')
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await act(async () => waitFor(() => {
      user.clear(screen.getByLabelText(/Name/))
    }))
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test product name 2')
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const mockCreateProduct = generateMockApolloData(
      CREATE_PRODUCT,
      {
        name: 'Test Product',
        slug: 'test_product',
        aliases: ['test1','test2'],
        website: 'testproduct.com',
        description: '<p>test product description</p>',
        commercialProduct: false,
        hostingModel: null,
        pricingModel: null,
        pricingDetails: null
      },
      null,
      createProductSuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreateProduct]} allowDebugMessage>
        <ProductForm product={product} />
      </CustomMockedProvider>
    )
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    await screen.findByText('Product submitted successfully')
    expect(container).toMatchSnapshot()
  })

  test('Should display failure toast on submit.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const mockCreateProduct = generateMockApolloData(
      CREATE_PRODUCT,
      {
        name: 'Test Product',
        slug: 'test_product',
        aliases: ['test1', 'test2'],
        website: 'testproduct.com',
        description: '<p>test product description</p>',
        commercialProduct: false,
        hostingModel: null,
        pricingModel: null,
        pricingDetails: null
      },
      null,
      createProductFailure
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreateProduct]} allowDebugMessage>
        <ProductForm product={product} />
      </CustomMockedProvider>
    )
    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    await screen.findAllByText('Product submission failed')
    expect(container).toMatchSnapshot()
  })
})
