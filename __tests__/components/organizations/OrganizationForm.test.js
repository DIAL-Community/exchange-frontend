import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import OrganizationForm from '../../../components/organizations/OrganizationForm'
import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { organization } from './data/OrganizationForm'

mockNextUseRouter()
describe('Unit tests for the OrganizationForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const ORGANIZATION_NAME_TEST_ID = 'organization-name'
  const ORGANIZATION_WEBSITE_TEST_ID = 'organization-website'
  const ORGANIZATION_DESCRIPTION_TEST_ID = 'organization-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should match snapshot - create.', () => {
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationForm />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - edit.', () => {
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationForm organization={organization} />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <OrganizationForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Name/), 'test organization name')
    await user.type(screen.getByLabelText(/Website/), 'test organization website')
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <OrganizationForm />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_WEBSITE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test organization name')
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test organization name 2')
    await user.type(screen.getByLabelText(/Website/), 'test organization website')
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(ORGANIZATION_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
