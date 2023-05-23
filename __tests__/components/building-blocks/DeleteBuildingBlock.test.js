import { act } from 'react-dom/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import DeleteBuildingBlock from '../../../components/building-blocks/DeleteBuildingBlock'
import { DELETE_BUILDING_BLOCK } from '../../../mutations/building-block'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../../queries/building-block'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { buildingBlock } from './data/BuildingBlockForm'

mockNextUseRouter()
describe('Unit tests for the DeleteBuildingBlock component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open confirmation dialog after clicking delete button.', async () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteBuildingBlock buildingBlock={buildingBlock}/>
      </CustomMockedProvider>
    )
    await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close confirmation dialog.', () => {
    test('after clicks "Cancel" button.', async () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteBuildingBlock buildingBlock={buildingBlock}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID)))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('Should failed to execute mutation after clicking confirm button.', async () => {
      const mockFailedMutation = generateMockApolloData(
        DELETE_BUILDING_BLOCK,
        { id: buildingBlock.id },
        new Error('An error occurred')
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockFailedMutation]}>
          <DeleteBuildingBlock buildingBlock={buildingBlock} />
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(getByText('Building block deletion failed.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })

    test('Should successfully execute mutation after clicking confirm button.', async () => {
      const mockSuccessfulMutation = generateMockApolloData(
        DELETE_BUILDING_BLOCK,
        { id: buildingBlock.id },
        null,
        {
          data: {
            deleteBuildingBlock: {
              buildingBlock: {
                id: buildingBlock.id,
                name: buildingBlock.name,
                slug: buildingBlock.slug
              },
              errors: []
            }
          }
        }
      )

      const mockDetailQuery = generateMockApolloData(
        BUILDING_BLOCK_DETAIL_QUERY,
        { slug: buildingBlock.slug },
        null,
        {
          data: {
            buildingBlock
          }
        }
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockSuccessfulMutation, mockDetailQuery]}>
          <DeleteBuildingBlock buildingBlock={buildingBlock}/>
        </CustomMockedProvider>
      )
      await act(() => fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID)))
      await act(() => fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID)))

      await waitFor(() => expect(getByText('Building block deleted successfully.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
