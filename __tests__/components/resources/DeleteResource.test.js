import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeleteResource from '../../../components/resources/DeleteResource'
import { render, mockObserverImplementation } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { DELETE_RESOURCE } from '../../../mutations/resource'
import { RESOURCE_DETAIL_QUERY } from '../../../queries/resource'
import { resource } from './data/ResourceDetail'

mockNextUseRouter()
describe('Unit tests for the ResourceDelete component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  const deleteVars = { id: 1 }
  const deleteData = {
    data: {
      deleteResource: {
        resource: {
          id: 1,
          name: 'Example Resource',
          slug: 'example_resource'
        },
        errors: []
      }
    }
  }
  const mockDelete = generateMockApolloData(DELETE_RESOURCE, deleteVars, null, deleteData)

  const resourceVars = { slug: 'example_resource' }
  const resourceData = { data: { resource } }
  const mockResource = generateMockApolloData(RESOURCE_DETAIL_QUERY, resourceVars, null, resourceData)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open ConfirmActionDialog after clicks "Delete" button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteResource resource={resource}/>
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
          <DeleteResource resource={resource}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('after clicks "Confirm" button', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider mocks={[mockDelete, mockResource]}>
          <DeleteResource resource={resource}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
