import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import OrganizationDetailContacts from '../../../components/organizations/OrganizationDetailContacts'
import { CONTACT_SEARCH_QUERY } from '../../../queries/contact'
import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { contacts } from './data/OrganizationDetailContacts'
import { organization } from './data/OrganizationForm'

mockNextUseRouter()
describe('Unit test for the OrganizationDetailContacts component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const ASSIGN_BUTTON_TEST_ID = 'assign-button'
  const NAME_INPUT_TEST_ID = 'name-input'
  const EMAIL_INPUT_TEST_ID = 'email-input'
  const TITLE_INPUT_TEST_ID = 'title-input'

  const mockContacts = generateMockApolloData(CONTACT_SEARCH_QUERY, { search: '' }, null, contacts)

  test('Should assign button have text "Assign"', () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockContacts]} addTypename={false}>
        <OrganizationDetailContacts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    expect(getByTestId(ASSIGN_BUTTON_TEST_ID)).toHaveTextContent('Assign')
    expect(container).toMatchSnapshot()
  })

  test('If input name is empty shouldn\'t add pill after clicking assign', async () => {
    const { container, getByTestId, queryByTestId } = render(
      <CustomMockedProvider mocks={[mockContacts]} addTypename={false}>
        <OrganizationDetailContacts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))

    const input = getByTestId(NAME_INPUT_TEST_ID)

    fireEvent.change(input, { target: { value: '' } })
    await act(async () => fireEvent.click(getByTestId(ASSIGN_BUTTON_TEST_ID)))
    expect(queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add pill after click assign button if input name has value', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockContacts]} addTypename={false}>
        <OrganizationDetailContacts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))

    const inputName = getByTestId(NAME_INPUT_TEST_ID)
    const inputEmail = getByTestId(EMAIL_INPUT_TEST_ID)

    fireEvent.change(inputName, { target: { value: contacts.data.name } })
    fireEvent.change(inputEmail, { target: { value: contacts.data.email } })
    await act(async () => fireEvent.click(getByTestId(ASSIGN_BUTTON_TEST_ID)))
    await screen.findByTestId(PILL_TEST_ID)

    expect(getByTestId(PILL_TEST_ID)).toHaveTextContent(`Name: ${contacts.data.name}`)
    expect(container).toMatchSnapshot()
  })

  test('Should remove pill after click close icon on pill', async () => {
    const { container, getByTestId, queryByTestId } = render(
      <CustomMockedProvider mocks={[mockContacts]} addTypename={false}>
        <OrganizationDetailContacts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))

    const inputName = getByTestId(NAME_INPUT_TEST_ID)
    const inputEmail = getByTestId(EMAIL_INPUT_TEST_ID)

    fireEvent.change(inputName, { target: { value: contacts.data.name } })
    fireEvent.change(inputEmail, { target: { value: contacts.data.email } })
    await act(async () => fireEvent.click(getByTestId(ASSIGN_BUTTON_TEST_ID)))
    await screen.findByTestId(PILL_TEST_ID)

    expect(getByTestId(PILL_TEST_ID)).toHaveTextContent(`Name: ${contacts.data.name}`)

    const removePillButton = getByTestId(PILL_REMOVE_BUTTON_TEST_ID)

    fireEvent.click(removePillButton)
    expect(queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should clear inputs after click assign button', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockContacts]} addTypename={false}>
        <OrganizationDetailContacts
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))

    const inputName = getByTestId(NAME_INPUT_TEST_ID)
    const inputEmail = getByTestId(EMAIL_INPUT_TEST_ID)
    const inputTitle = getByTestId(TITLE_INPUT_TEST_ID)

    fireEvent.change(inputName, { target: { value: contacts.data.name } })
    fireEvent.change(inputEmail, { target: { value: contacts.data.email } })
    fireEvent.change(inputTitle, { target: { value: contacts.data.title } })
    await act(async () => fireEvent.click(getByTestId(ASSIGN_BUTTON_TEST_ID)))

    expect(inputName).toHaveTextContent('')
    expect(inputEmail).toHaveTextContent('')
    expect(inputTitle).toHaveTextContent('')
    expect(container).toMatchSnapshot()
  })
})
