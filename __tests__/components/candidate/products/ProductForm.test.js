import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import ProductForm from '../../../../components/candidate/products/ProductForm'
import { render, waitForAllEffects } from '../../../test-utils'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../../utils/nextMockImplementation'
import CustomMockedProvider from '../../../utils/CustomMockedProvider'

mockNextUseRouter()
describe('Unit tests for the ProductForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANDIDATE_PRODUCT_NAME_TEST_ID = 'candidate-product-name'
  const CANDIDATE_PRODUCT_EMAIL_TEST_ID = 'candidate-product-email'
  const CANDIDATE_PRODUCT_DESCRIPTION_TEST_ID = 'candidate-product-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should match snapshot - candidate product.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Name/), 'test name')
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_DESCRIPTION_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email/), 'test@test.com')
    expect(getByTestId(CANDIDATE_PRODUCT_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <ProductForm />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test product name')
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test product name 2')
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email/), 'test@test.com')
    expect(getByTestId(CANDIDATE_PRODUCT_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_PRODUCT_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_PRODUCT_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
