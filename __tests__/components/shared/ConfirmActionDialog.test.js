import { fireEvent } from '@testing-library/react'
import ConfirmActionDialog from '../../../components/shared/ConfirmActionDialog'
import { mockObserverImplementation, render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the ConfirmActionDialog component.', () => {
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const TITLE_TEST_ID = 'title'
  const MESSAGE_TEST_ID = 'message'
  const mockDialogTitle = 'Mock Dialog Title'
  const mockDialogMessage = 'Mock dialog message'
  const mockIsDialogOpen = true
  const mockSetIsDialogOpen = jest.fn()
  const mockOnConfirm = jest.fn()
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'

  beforeAll(
    window.IntersectionObserver = mockObserverImplementation()
  )

  test('Should match snapshot.', () => {
    const { getByTestId } = render(
      <ConfirmActionDialog
        title={mockDialogTitle}
        message={mockDialogMessage}
        onConfirm={mockOnConfirm}
        isOpen={mockIsDialogOpen}
        onClose={mockSetIsDialogOpen}
      />
    )
    expect(getByTestId(TITLE_TEST_ID)).toHaveTextContent(mockDialogTitle)
    expect(getByTestId(MESSAGE_TEST_ID)).toHaveTextContent(mockDialogMessage)
    expect(getByTestId(CONFIRM_BUTTON_TEST_ID)).toHaveTextContent('Confirm')
    expect(getByTestId(CANCEL_BUTTON_TEST_ID)).toHaveTextContent('Cancel')
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  test('Should call the onClose function after clicking the "Cancel" button.', () => {
    const { getByTestId } = render(
      <ConfirmActionDialog
        title={mockDialogTitle}
        message={mockDialogMessage}
        onConfirm={mockOnConfirm}
        isOpen={mockIsDialogOpen}
        onClose={mockSetIsDialogOpen}
      />
    )
    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(mockSetIsDialogOpen).toHaveBeenCalled()
  })

  test('Should call the onConfirm function after clicking the "Confirm" button.', () => {
    const { getByTestId } = render(
      <ConfirmActionDialog
        title={mockDialogTitle}
        message={mockDialogMessage}
        onConfirm={mockOnConfirm}
        isOpen={mockIsDialogOpen}
        onClose={mockSetIsDialogOpen}
      />
    )
    fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))
    expect(mockOnConfirm).toHaveBeenCalled()
  })
})
