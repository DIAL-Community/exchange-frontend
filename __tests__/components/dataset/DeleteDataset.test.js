import { fireEvent, waitFor } from '@testing-library/react'
import DeleteDataset from '../../../components/datasets/DeleteDataset'
import { DELETE_DATASET } from '../../../mutations/dataset'
import { DATASET_QUERY } from '../../../queries/dataset'
import { mockObserverImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { dataset } from './data/DatasetForm'

mockNextUseRouter()
describe('Unit tests for the DeleteDataset component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const CONFIRM_ACTION_DIALOG_TEST_ID = 'confirm-action-dialog'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const CONFIRM_BUTTON_TEST_ID = 'confirm-button'

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should open confirmation dialog after clicking delete button.', () => {
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DeleteDataset dataset={dataset}/>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toBeVisible()
    expect(getByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).toMatchSnapshot()
  })

  describe('Should close confirmation dialog.', () => {
    test('after clicks "Cancel" button.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <DeleteDataset dataset={dataset} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
      expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument()
    })

    test('Should failed to execute mutation after clicking confirm button.', async () => {
      const mockFailedMutation = generateMockApolloData(
        DELETE_DATASET,
        { id: dataset.id },
        new Error('An error occurred')
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockFailedMutation]}>
          <DeleteDataset dataset={dataset} />
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Open data record deletion failed.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })

    test('Should successfully execute mutation after clicking confirm button.', async () => {
      const mockSuccessfulMutation = generateMockApolloData(
        DELETE_DATASET,
        { id: dataset.id },
        null,
        {
          data: {
            deleteDataset: {
              dataset: {
                id: dataset.id,
                name: dataset.name,
                slug: dataset.slug
              },
              errors: []
            }
          }
        }
      )

      const mockDetailQuery = generateMockApolloData(
        DATASET_QUERY,
        { slug: dataset.slug },
        null,
        {
          data: {
            dataset
          }
        }
      )

      const { getByTestId, queryByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockDetailQuery, mockSuccessfulMutation]}>
          <DeleteDataset dataset={dataset}/>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
      fireEvent.click(getByTestId(CONFIRM_BUTTON_TEST_ID))

      await waitFor(() => expect(getByText('Open data record deleted successfully.')).toBeInTheDocument())
      await waitFor(() => expect(queryByTestId(CONFIRM_ACTION_DIALOG_TEST_ID)).not.toBeInTheDocument())
    })
  })
})
