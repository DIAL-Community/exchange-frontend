import { fireEvent, waitFor } from '@testing-library/react'
import DeletePlaybook from '../../../components/playbooks/DeletePlaybook'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { playbookDetail } from './data/DeletePlaybookDetail'

mockNextUseRouter()
describe('Unit tests for the DeletePlaybook component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeletePlaybook playbook={playbookDetail}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close ConfirmActionDialog', () => {
    test('after clicks "Cancel" button.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeletePlaybook playbook={playbookDetail}/>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeletePlaybook playbook={playbookDetail}/>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})