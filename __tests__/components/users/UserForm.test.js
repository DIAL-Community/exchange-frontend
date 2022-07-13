import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { UserForm } from '../../../components/users/UserForm'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffects,
  waitForAllEffectsAndSelectToLoad
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { user } from './data/UserForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for the UserForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const EMAIL_INPUT_TEST_ID = 'email-input'
  const EMAIL_LABEL_TEST_ID = 'email-label'
  const USER_NAME_INPUT_TEST_ID = 'username-input'
  const USER_NAME_LABEL_TEST_ID = 'username-label'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation(true)
  })

  test('Should match snapshot - edit.', async () => {
    const { container } = render(
      <CustomMockedProvider>
        <UserForm user={user} action='update'/>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const someUser = userEvent.setup()
    const { getByTestId } = render(
      <CustomMockedProvider>
        <UserForm user={user} action='update' />
      </CustomMockedProvider>
    )
    await someUser.type(getByTestId(EMAIL_INPUT_TEST_ID), 'user_test@web.com')
    await someUser.type(getByTestId(USER_NAME_INPUT_TEST_ID), 'User Test')
    expect(getByTestId(EMAIL_INPUT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_INPUT_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
      
    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(EMAIL_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const someUser = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <UserForm user={user} action='update'/>
      </CustomMockedProvider>
    )
    await someUser.clear(getByTestId(EMAIL_INPUT_TEST_ID))
    await someUser.clear(getByTestId(USER_NAME_INPUT_TEST_ID))

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    
    await waitForAllEffectsAndSelectToLoad(container)
    
    expect(getByTestId(EMAIL_LABEL_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await someUser.type(getByTestId(EMAIL_INPUT_TEST_ID), 'user_test@web.com')
    await someUser.type(getByTestId(USER_NAME_INPUT_TEST_ID), 'User Test')
    expect(getByTestId(EMAIL_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(USER_NAME_LABEL_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })
})
