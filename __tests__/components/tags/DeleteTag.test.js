import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import DeleteTag from '../../../components/tags/DeleteTag'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_TAG } from '../../../mutations/tag'
import { TAGS_LIST_QUERY } from '../../../queries/tag'
import { tag } from './data/TagCard'

mockNextUseRouter()
describe('Unit tests for the DeletTag component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = {
    data: {
      deleteTag: {
        tag: null,
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_TAG, deleteVars, null, deleteData)

  const tagListData = { data: { searchTags: {} } }
  const mockTagList = generateMockApolloData(TAGS_LIST_QUERY, { search: '' }, null, tagListData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <DeleteTag tag={tag}/>
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(container).toMatchSnapshot()
  })

  describe('Should close ConfirmActionDialog after clicks', () => {
    test('"Cancel" button.', async () => {
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteTag tag={tag} />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()

      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('"Confirm" button', async () => {
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockTagList]}>
          <DeleteTag tag={tag} />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()

      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
