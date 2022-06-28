import { fireEvent, getAllByTestId, screen } from '@testing-library/react'
import {
  mockRouterImplementation,
  mockSessionImplementation,
  render,
  waitForAllEffectsAndSelectToLoad,
} from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'
import ProjectDetailOrganizations from '../../../components/projects/ProjectDetailOrganizations'
import { organizations, organizationOwnerUserProps } from './data/ProjectDetailOrganizations'
import { projectOrganization } from './data/ProjectForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the ProjectDetailOrganizations component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const ORGANIZATION_SEARCH_TEST_ID = 'organization-search'
  const ORGANIZATION_SEARCH_OPTION_LABEL = 'Another Organization'
  const PROJECT_TEST_ORGANIZATION_LABEL = 'Test Organization'
  const PROJECT_TEST_ORGANIZATION_OWNED_LABEL = 'owned organization'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockOrganizations = generateMockApolloData(ORGANIZATION_SEARCH_QUERY, { search: '' }, null, organizations)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={false}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={true}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={true}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId, getAllByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={true}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    await screen.findByText(PROJECT_TEST_ORGANIZATION_LABEL)
    fireEvent.click(getAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)[0])
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={true}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(ORGANIZATION_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(ORGANIZATION_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(ORGANIZATION_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(ORGANIZATION_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(ORGANIZATION_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
  })

  test('Should render Organizations with read only owned organization pill', async () => {
    mockSessionImplementation(false, organizationOwnerUserProps)
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockOrganizations]}>
        <ProjectDetailOrganizations
          canEdit={true}
          project={projectOrganization}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(PROJECT_TEST_ORGANIZATION_OWNED_LABEL)).toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(screen.queryAllByTestId(PILL_REMOVE_BUTTON_TEST_ID)).toHaveLength(1)
    expect(container).toMatchSnapshot()

  })
})
