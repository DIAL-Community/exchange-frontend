import { fireEvent } from '@testing-library/react'
import Dialog, { DialogType } from '../../../components/shared/Dialog'
import {
  mockObserverImplementation,
  mockRouterImplementation,
  render
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'

jest.mock('next/dist/client/router')

describe('Unit test for the Dialog component.', () => {
  const DIALOG_TEST_ID = 'dialog'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CLOSE_BUTTON_TEST_ID = 'close-button'
  const DIALOG_BODY_TEST_ID = 'dialog-body'
  const mockDialogBody = 'Mock Dialog Body'
  const mockOnClose = jest.fn()

  beforeAll(() => {
    mockRouterImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })


  test('Should not be visible when is not open.', () => {
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <Dialog isOpen={false} />
      </CustomMockedProvider>
    )
    expect(queryByTestId(DIALOG_TEST_ID)).not.toBeInTheDocument()
  })

  describe('Should match snapshot -', () => {
    test('when Dialog has form type with submit and cancel button.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <Dialog
            submitButton
            cancelButton
            isOpen={true}
            onClose={mockOnClose}
            dialogType={DialogType.FORM}
          >
            {mockDialogBody}
          </Dialog>
        </CustomMockedProvider>
      )
      expect(getByTestId(DIALOG_BODY_TEST_ID)).toHaveTextContent(mockDialogBody)
      expect(getByTestId(SUBMIT_BUTTON_TEST_ID)).toHaveTextContent('Submit')
      expect(getByTestId(CANCEL_BUTTON_TEST_ID)).toHaveTextContent('Cancel')
      expect(queryByTestId(CLOSE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()
    })
      
    test('when Dialog has default type and has close button.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <Dialog
            closeButton
            isOpen={true}
            onClose={mockOnClose}
          >
            {mockDialogBody}
          </Dialog>
        </CustomMockedProvider>
      )
      expect(getByTestId(DIALOG_BODY_TEST_ID)).toHaveTextContent(mockDialogBody)
      expect(getByTestId(CLOSE_BUTTON_TEST_ID)).toHaveTextContent('Close')
      expect(queryByTestId(SUBMIT_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(queryByTestId(CANCEL_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()
    })
  })

  describe('Should call', () => {
    test('the onClose function after clicking the "Cancel" button.', () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <Dialog
            submitButton
            cancelButton
            isOpen={true}
            onClose={mockOnClose}
            dialogType={DialogType.FORM}
          >
            {mockDialogBody}
          </Dialog>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      expect(mockOnClose).toBeCalled()
    })

    test('the onClose function after clicking the "Close" button.', () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <Dialog
            closeButton
            isOpen={true}
            onClose={mockOnClose}
          >
            {mockDialogBody}
          </Dialog>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(CLOSE_BUTTON_TEST_ID))
      expect(mockOnClose).toBeCalled()
    })
  })
})
