import { within } from '@testing-library/dom'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { UserForm } from '../../../components/users/UserForm'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import { USER_ROLES } from '../../../queries/user'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { organization, user, userRoles } from './data/UserForm'

jest.mock('../../../lib/hooks', () => ({
  useEmailValidation: () => ({
    isUniqueUserEmail: () => false
  })
}))

mockNextUseRouter()
describe('Unit tests for the UserForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const EMAIL_INPUT_TEST_ID = 'email-input'
  const EMAIL_LABEL_TEST_ID = 'email-label'

  const CONFIRMED_CHECKBOX_TEST_ID = 'user-is-confirmed'

  const USER_NAME_INPUT_TEST_ID = 'username-input'
  const USER_NAME_LABEL_TEST_ID = 'username-label'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockUserRoles = generateMockApolloData(USER_ROLES, null, userRoles)
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organization)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
  })

  describe('Should match snapshot', () => {
    test('- create.', async () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
          <UserForm />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })

    test('- edit.', async () => {
      const { container, getByText } = render(
        <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
          <UserForm user={user} />
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(getByText(/User Test/)).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const someUser = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
        <UserForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await someUser.type(getByTestId(EMAIL_INPUT_TEST_ID), 'usertest@web.com')
    await someUser.type(getByTestId(USER_NAME_INPUT_TEST_ID), 'User Test')

    expect(getByTestId(EMAIL_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_INPUT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(getByTestId(EMAIL_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(container).toMatchSnapshot()
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const someUser = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
        <UserForm />
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await someUser.clear(getByTestId(EMAIL_INPUT_TEST_ID))
    await someUser.clear(getByTestId(USER_NAME_INPUT_TEST_ID))

    act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(getByTestId(EMAIL_LABEL_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await someUser.type(getByTestId(EMAIL_INPUT_TEST_ID), 'usertest@web.com')
    await someUser.type(getByTestId(USER_NAME_INPUT_TEST_ID), 'User Test')
    expect(getByTestId(EMAIL_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(container).toMatchSnapshot()
  })

  test('Should render unchecked based on the confirmed flag data.', async () => {
    const { container, queryByTestId } = render(
      <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
        <UserForm user={user} />
      </CustomMockedProvider>
    )

    const checkboxLabel = queryByTestId(CONFIRMED_CHECKBOX_TEST_ID)
    const checkbox = within(checkboxLabel).queryByTestId('checkbox')
    expect(checkbox.checked).toEqual(false)
    expect(container).toMatchSnapshot()
  })

  test('Should render checked based on the confirmed flag data.', async () => {
    user.confirmed = true
    const { container, queryByTestId } = render(
      <CustomMockedProvider mocks={[mockUserRoles, mockOrganizations]}>
        <UserForm user={user} />
      </CustomMockedProvider>
    )

    const checkboxLabel = queryByTestId(CONFIRMED_CHECKBOX_TEST_ID)
    const checkbox = within(checkboxLabel).queryByTestId('checkbox')
    expect(checkbox.checked).toEqual(true)
    expect(container).toMatchSnapshot()
  })
})
