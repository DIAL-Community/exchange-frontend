import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import DeleteCategoryIndicator from '../../../components/category-indicators/DeleteCategoryIndicator'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { CATEGORY_INDICATOR_QUERY } from '../../../queries/category-indicator'
import { DELETE_CATEGORY_INDICATOR } from '../../../mutations/category-indicator'
import { categoryIndicator } from './data/CategoryIndicatorForm'

mockNextUseRouter()

describe('Unit tests for the DeleteCategoryIndicator component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = {
    data: {
      deleteCategoryIndicator: {
        rubricCategorySlug: 'test_category_indicator',
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_CATEGORY_INDICATOR, deleteVars, null, deleteData)

  const indicatorVars = { slug: 'test_category_indicator' }
  const indicatorData = { data: { categoryIndicator: null } }
  const mockIndicator = generateMockApolloData(CATEGORY_INDICATOR_QUERY, indicatorVars , null, indicatorData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteCategoryIndicator categoryIndicator={categoryIndicator}/>
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
          <DeleteCategoryIndicator categoryIndicator={categoryIndicator}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockIndicator]}>
          <DeleteCategoryIndicator categoryIndicator={categoryIndicator}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
