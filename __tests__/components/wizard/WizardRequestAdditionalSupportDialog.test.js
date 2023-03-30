import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdditionalSupportDialog from '../../../components/wizard/AdditionalSupportDialog'
import { mockObserverImplementation, render, waitForAllEffects } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import CustomMockedProvider from '../../utils/CustomMockedProvider'

mockNextUseRouter()

describe('Unit test for the AdditionalSupportDialog component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const NAME_TEST_ID = 'name'
  const EMAIL_ADDRESS_TEST_ID = 'email-address'
  const MESSAGE_TEST_ID = 'message'
  const mockIsDialogOpen = true
  const mockSetIsDialogOpen = jest.fn()
  const DIALOG_TEST_ID = 'dialog'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const INVALID_EMAIL_ADDRESS_MESSAGE = 'Please enter a valid email address'
  const MESSAGE_TOO_SHORT_MESSAGE = 'Message must be at least 20 characters'

  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should match snapshot.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <AdditionalSupportDialog
          isOpen={mockIsDialogOpen}
          onClose={mockSetIsDialogOpen}
        />
      </CustomMockedProvider>
    )
    expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()
  })

  test('Should call the onClose function after clicking the "Cancel" button.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <AdditionalSupportDialog
          isOpen={mockIsDialogOpen}
          onClose={mockSetIsDialogOpen}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(mockSetIsDialogOpen).toHaveBeenCalled()
  })

  test('Should display validation errors after clicking the "Confirm" button.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <AdditionalSupportDialog
          isOpen={mockIsDialogOpen}
          onClose={mockSetIsDialogOpen}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(SUBMIT_BUTTON_TEST_ID))
    await waitForAllEffects(1000)
    expect(getByTestId(NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(EMAIL_ADDRESS_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(MESSAGE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()

    await user.type(screen.getByLabelText(/Name/), 'test name')
    expect(getByTestId(NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email Address/), 'test email address')
    expect(getByTestId(EMAIL_ADDRESS_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(EMAIL_ADDRESS_TEST_ID)).toHaveTextContent(INVALID_EMAIL_ADDRESS_MESSAGE)

    await user.clear(screen.getByLabelText(/Email Address/))
    await user.type(screen.getByLabelText(/Email Address/), 'test@email.address')
    expect(getByTestId(EMAIL_ADDRESS_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(EMAIL_ADDRESS_TEST_ID)).not.toHaveTextContent(INVALID_EMAIL_ADDRESS_MESSAGE)

    await user.type(screen.getByLabelText(/Message/), 'test message')
    expect(getByTestId(MESSAGE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(MESSAGE_TEST_ID)).toHaveTextContent(MESSAGE_TOO_SHORT_MESSAGE)

    await user.type(screen.getByLabelText(/Message/), 'test message')
    expect(getByTestId(MESSAGE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(MESSAGE_TEST_ID)).not.toHaveTextContent(MESSAGE_TOO_SHORT_MESSAGE)
  })
})
