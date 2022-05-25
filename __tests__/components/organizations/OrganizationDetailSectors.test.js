import { fireEvent, screen } from '@testing-library/react'
import OrganizationDetailSectors from '../../../components/organizations/OrganizationDetailSectors'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { organization } from './data/OrganizationForm'
import { sectors } from './data/OrganizationDetailSectors'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the OrganizationDetailSectors component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SECTOR_SEARCH_TEST_ID = 'sector-search'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <OrganizationDetailSectors
          canEdit={false}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <OrganizationDetailSectors
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <OrganizationDetailSectors
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
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <OrganizationDetailSectors
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
      <CustomMockedProvider mocks={[mockSectors]} addTypename={false}>
        <OrganizationDetailSectors
          canEdit={true}
          organization={organization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText('Sector 1')
    fireEvent.click(getByText('Sector 1'))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText('Sector 2')
    fireEvent.click(getByText('Sector 2'))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText('Test Sector')).toBeInTheDocument()
    expect(screen.queryByText('Sector 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Sector 2')).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText('Type to search...')

    expect(screen.queryByText('Test Sector')).toBeInTheDocument()
    expect(screen.queryByText('Sector 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Sector 2')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
