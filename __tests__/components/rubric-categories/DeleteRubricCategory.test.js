import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import DeleteRubricCategory from '../../../components/rubric-categories/DeleteRubricCategory'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_RUBRIC_CATEGORY } from '../../../mutations/rubric-category'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { rubricCategory } from './data/RubricCategoryDetail'

mockNextUseRouter()
describe('Unit tests for the DeleteRubricCategory component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = { 'data': { 'deleteRubricCategory': { 'errors': [] } } }
  const mockDelete = generateMockApolloData(DELETE_RUBRIC_CATEGORY, deleteVars, null, deleteData)

  const mockRubricVars = { slug: 'rc_name' }
  const mockRubricData = rubricCategory
  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, mockRubricVars, null, mockRubricData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteRubricCategory rubricCategory={rubricCategory}/>
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
          <DeleteRubricCategory rubricCategory={rubricCategory}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { rubricCategory: categoryData } = rubricCategory.data
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockRubricCategory]}>
          <DeleteRubricCategory rubricCategory={categoryData}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
