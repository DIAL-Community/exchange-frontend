import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import DatasetForm from '../../../components/datasets/DatasetForm'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { dataset } from './data/DatasetForm'

mockNextUseRouter()

describe('Unit tests for the DatasetForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const DATASET_NAME_TEST_ID = 'dataset-name'
  const DATASET_WEBSITE_TEST_ID = 'dataset-website'
  const DATASET_DESCRIPTION_TEST_ID = 'dataset-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  describe('Should match snapshot -.', () => {
    test('create', () => {
      const { container } = render(
        <CustomMockedProvider>
          <DatasetForm />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('edit.', async () => {
      const { container } = render(
        <CustomMockedProvider>
          <DatasetForm dataset={dataset} />
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Open Data Name/), 'test dataset name')
    await user.type(screen.getByLabelText(/Open Data Website/), 'test dataset website')
    expect(getByTestId(DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <DatasetForm />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(DATASET_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_WEBSITE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Open Data Name/), 'test dataset name')
    expect(getByTestId(DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Open Data Name/))
    expect(getByTestId(DATASET_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Open Data Name/), 'test dataset name 2')
    await user.type(screen.getByLabelText(/Open Data Website/), 'test dataset website')
    expect(getByTestId(DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(DATASET_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(DATASET_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
