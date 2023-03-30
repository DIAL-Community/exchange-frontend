import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import CommentsList from '../../../components/shared/comment/CommentsList'
import { DELETE_COMMENT } from '../../../mutations/comment'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { comments, deleteCommentFailure, deleteCommentSuccess } from './data/CommentsList'

mockNextUseRouter()
describe('Unit test for the CommentsList component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const mockOnClose = jest.fn()
  const mockRefetch = jest.fn()

  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot', () => {
    test('loading comments.', () => {
      const { container } = render(
        <CommentsList
          comments={comments}
          refetch={mockRefetch}
          loading={true}
          onClose={mockOnClose}
        />
      )
      expect(container).toMatchSnapshot()
    })

    test('without comments.', () => {
      const { container } = render(
        <CommentsList
          comments={[]}
          refetch={mockRefetch}
          loading={false}
          onClose={mockOnClose}
        />
      )
      expect(container).toMatchSnapshot()
    })

    test('with comments.', () => {
      const { container } = render(
        <CustomMockedProvider addTypename={false}>
          <CommentsList
            comments={comments}
            refetch={mockRefetch}
            loading={false}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })
  })

  test('Should open ConfirmActionDialog after user clicks "Delete" button.', () => {
    const { getByTestId, getAllByTestId } = render(
      <CustomMockedProvider addTypename={false}>
        <CommentsList
          comments={comments}
          refetch={mockRefetch}
          loading={false}
          onClose={mockOnClose}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getAllByTestId(DELETE_BUTTON_TEST_ID)[0])
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  test('Should close ConfirmActionDialog after user clicks "Cancel" button.', async () => {
    const { getByTestId, getAllByTestId, queryByTestId } = render(
      <CustomMockedProvider addTypename={false}>
        <CommentsList
          comments={comments}
          refetch={mockRefetch}
          loading={false}
          onClose={mockOnClose}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getAllByTestId(DELETE_BUTTON_TEST_ID)[0])
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    await act(async () => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
    expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeNull()
  })

  describe('Should delete a comment after user clicks "Confirm" button', () => {
    test('successfully.', async () => {
      const mockDeleteComment = generateMockApolloData(
        DELETE_COMMENT,
        { commentId: '100' },
        null,
        deleteCommentSuccess
      )
      const { getByTestId, getAllByTestId, findByText } = render(
        <CustomMockedProvider mocks={[mockDeleteComment]} addTypename={false}>
          <CommentsList
            comments={comments}
            refetch={mockRefetch}
            loading={false}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      fireEvent.click(getAllByTestId(DELETE_BUTTON_TEST_ID)[0])
      await act(async () => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))
      expect(await findByText('Comment deleted successfully')).toBeInTheDocument()
    })

    test('with failure', async () => {
      const mockDeleteComment = generateMockApolloData(
        DELETE_COMMENT,
        { commentId: '100' },
        new Error('An error occurred'),
        deleteCommentFailure
      )
      const { getByTestId, getAllByTestId, findByText } = render(
        <CustomMockedProvider mocks={[mockDeleteComment]} addTypename={false}>
          <CommentsList
            comments={comments}
            refetch={mockRefetch}
            loading={false}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      fireEvent.click(getAllByTestId(DELETE_BUTTON_TEST_ID)[0])
      await act(async () => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))
      expect(await findByText('Comment deletion failed')).toBeInTheDocument()
    })
  })
})
