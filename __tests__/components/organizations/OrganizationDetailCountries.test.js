import { fireEvent, screen } from '@testing-library/react'
import { OrganizationDetailCountries } from '../../../components/organizations/OrganizationDetailCountries'
import { COUNTRY_SEARCH_QUERY } from '../../../queries/country'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { countries } from './data/OrganizationDetailCountries'
import { organization } from './data/OrganizationForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the OrganizationDetailCountries component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const COUNTRY_SEARCH_TEST_ID = 'country-search'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockCountries = generateMockApolloData(COUNTRY_SEARCH_QUERY, { search: '' }, null, countries)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountries]} addTypename={false}>
        <OrganizationDetailCountries
          canEdit={false}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountries]} addTypename={false}>
        <OrganizationDetailCountries
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]} addTypename={false}>
        <OrganizationDetailCountries
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]} addTypename={false}>
        <OrganizationDetailCountries
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockCountries]} addTypename={false}>
        <OrganizationDetailCountries
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    fireEvent.keyDown(getByTestId(COUNTRY_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText('Another Country')
    fireEvent.click(getByText('Another Country'))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText('Test Country')).toBeInTheDocument()
    expect(screen.queryByText('Another Country')).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    expect(screen.queryByText('Test Country')).toBeInTheDocument()
    expect(screen.queryByText('Another Country')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
