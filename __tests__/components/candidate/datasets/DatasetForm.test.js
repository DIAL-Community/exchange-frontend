import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { render, waitForAllEffects } from '../../../test-utils'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../../utils/nextMockImplementation'
import CustomMockedProvider from '../../../utils/CustomMockedProvider'
import DatasetForm from '../../../../components/candidate/datasets/DatasetForm'

mockNextUseRouter()
describe('Unit tests for the DatasetForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANDIDATE_DATASET_NAME_TEST_ID = 'candidate-dataset-name'
  const CANDIDATE_DATASET_URL_TEST_ID = 'candidate-dataset-website'
  const CANDIDATE_DATASET_EMAIL_TEST_ID = 'candidate-dataset-email'
  const CANDIDATE_DATASET_DESCRIPTION_TEST_ID = 'candidate-dataset-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should match snapshot - candidate open data.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toHaveTextContent('You are not authorized to view this page')
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Name/), 'test name')
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Data URL/), 'test@test.com')
    expect(getByTestId(CANDIDATE_DATASET_URL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email Address/), 'test@test.com')
    expect(getByTestId(CANDIDATE_DATASET_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_URL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_URL_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test name')
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test product name 2')
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Data URL/), 'test@test.com')
    expect(getByTestId(CANDIDATE_DATASET_URL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email Address/), 'test@test.com')
    expect(getByTestId(CANDIDATE_DATASET_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
