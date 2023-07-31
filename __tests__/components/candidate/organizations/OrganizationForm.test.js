import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import OrganizationForm from '../../../../components/candidate/organizations/OrganizationForm'
import { render, waitForAllEffects } from '../../../test-utils'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../../utils/nextMockImplementation'
import CustomMockedProvider from '../../../utils/CustomMockedProvider'

mockNextUseRouter()
describe('Unit tests for the OrganizationForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const CANDIDATE_ORGANIZATION_NAME_TEST_ID = 'candidate-organization-name'
  const CANDIDATE_ORGANIZATION_ORGANIZATION_NAME_TEST_ID = 'candidate-organization-organization-name'
  const CANDIDATE_ORGANIZATION_TITLE_TEST_ID = 'candidate-organization-title'
  const CANDIDATE_ORGANIZATION_WEBSITE_TEST_ID = 'candidate-organization-website'
  const CANDIDATE_ORGANIZATION_EMAIL_TEST_ID = 'candidate-organization-email'
  const CANDIDATE_ORGANIZATION_DESCRIPTION_TEST_ID = 'candidate-organization-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  test('Should match snapshot - candidate organization.', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationForm />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render Unauthorized component for unauthorized user.', async () => {
    mockNextAuthUseSession(statuses.UNAUTHENTICATED)
    const { container } = render(
      <CustomMockedProvider>
        <OrganizationForm />
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
        <OrganizationForm />
      </CustomMockedProvider>
    )
    await user.type(screen.getByLabelText(/Your Name/), 'test name')
    await user.type(screen.getByLabelText(/Email/), 'test@test.com')
    await user.type(screen.getByLabelText(/Organization Name/), 'Organization Name')
    await user.type(screen.getByLabelText(/Website/), 'test.com')
    await user.type(screen.getByLabelText(/Title/), 'CEO')

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_TITLE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_DESCRIPTION_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
    const user = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <OrganizationForm />
      </CustomMockedProvider>
    )
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_ORGANIZATION_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_WEBSITE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_TITLE_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Your Name/), 'test organization name')
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Your Name/))
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Your Name/), 'test organziation name 2')
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Email/), 'test@test.com')
    expect(getByTestId(CANDIDATE_ORGANIZATION_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Organization Name/), 'Organization Name test')
    expect(getByTestId(CANDIDATE_ORGANIZATION_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Title/), 'CEO')
    expect(getByTestId(CANDIDATE_ORGANIZATION_TITLE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Website/), 'test.com')
    expect(getByTestId(CANDIDATE_ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(CANDIDATE_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_EMAIL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_ORGANIZATION_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_WEBSITE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_TITLE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(CANDIDATE_ORGANIZATION_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
