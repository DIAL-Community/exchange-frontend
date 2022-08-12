import { fireEvent } from '@testing-library/react'
import DeleteTag from '../../../components/tags/DeleteTag'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  mockObserverImplementation,
  waitForAllEffects,
  render
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { tag } from './data/TagCard'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for the DeletTag component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <DeleteTag tag={tag}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    await waitForAllEffects(container)
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
  })

  describe('Should close ConfirmActionDialog after clicks', () => {
    test('"Cancel" button.', async () => {
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteTag tag={tag} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      await waitForAllEffects(container)
      expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()

      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      await waitForAllEffects(container)
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('"Confirm" button', async () => {
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteTag tag={tag} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      await waitForAllEffects(container)
      expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()

      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))
      await waitForAllEffects(container)
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })
  })
})
