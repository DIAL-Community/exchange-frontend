import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeletePlaybook from '../../../components/playbooks/DeletePlaybook'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_PLAYBOOK } from '../../../mutations/playbook'
import { PLAYBOOK_QUERY } from '../../../queries/playbook'
import { playbookDetail } from './data/DeletePlaybookDetail'

mockNextUseRouter()
describe('Unit tests for the DeletePlaybook component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { 'id': 4 }
  const deleteData = {
    'data': {
      'deletePlaybook': {
        playbook: {
          id: 4,
          slug: 'example_playbook',
          name: 'Example Playbook'
        },
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_PLAYBOOK, deleteVars, null, deleteData)

  const playbookData = { data: { playbook: playbookDetail } }
  const playbookVars = { slug: 'example_playbook' }
  const mockPlaybook = generateMockApolloData(PLAYBOOK_QUERY, playbookVars, null, playbookData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeletePlaybook playbook={playbookDetail}/>
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close ConfirmActionDialog', () => {
    test('after clicks "Cancel" button.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeletePlaybook playbook={playbookDetail}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockPlaybook]}>
          <DeletePlaybook playbook={playbookDetail}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
