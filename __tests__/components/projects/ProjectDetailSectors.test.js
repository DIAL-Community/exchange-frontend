import { fireEvent, screen } from '@testing-library/react'
import ProjectDetailSectors from '../../../components/projects/ProjectDetailSectors'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffects, waitForReactSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { project, organizationOwnerUserProps } from './data/ProjectForm'
import { sectors } from './data/ProjectDetailSectors'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the ProjectDetailSectors component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const SECTOR_SEARCH_TEST_ID = 'sector-search'
  const SECTOR_SEARCH_PLACEHOLDER = 'Type to search...'
  const SECTOR_SEARCH_OPTION_1_LABEL = 'Sector 1'
  const SECTOR_SEARCH_OPTION_2_LABEL = 'Sector 2'
  const PROJECT_TEST_SECTOR_LABEL = 'Test Sector'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)

  beforeAll(() => {
    mockRouterImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    mockSessionImplementation(false)
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={false}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    mockSessionImplementation()
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - when user is Organization owner.', () => {
    mockSessionImplementation(false, organizationOwnerUserProps)
    const { container } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    mockSessionImplementation()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)
    await waitForReactSelectToLoad(container)
      
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    mockSessionImplementation()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)
      
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    mockSessionImplementation()
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockSectors]}>
        <ProjectDetailSectors
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SECTOR_SEARCH_OPTION_1_LABEL)
    fireEvent.click(getByText(SECTOR_SEARCH_OPTION_1_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(SECTOR_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(SECTOR_SEARCH_OPTION_2_LABEL)
    fireEvent.click(getByText(SECTOR_SEARCH_OPTION_2_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_SECTOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(SECTOR_SEARCH_PLACEHOLDER)

    expect(screen.queryByText(PROJECT_TEST_SECTOR_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(SECTOR_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
