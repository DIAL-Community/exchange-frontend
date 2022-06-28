import { fireEvent, screen, waitFor } from '@testing-library/react'
import ProjectDetailCountries from '../../../components/projects/ProjectDetailCountries'
import { COUNTRY_SEARCH_QUERY } from '../../../queries/country'
import { mockRouterImplementation, mockSessionImplementation, render, waitForReactSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { countries } from './data/ProjectDetailCountries'
import { project } from './data/ProjectForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit test for the ProjectDetailCountries component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const COUNTRY_SEARCH_TEST_ID = 'country-search'
  const COUNTRY_SEARCH_PLACEHOLDER = 'Type to search...'
  const COUNTRY_SEARCH_OPTION_LABEL = 'Another Country'
  const PROJECT_TEST_COUNTRY_LABEL = 'Test Country'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockCountries = generateMockApolloData(COUNTRY_SEARCH_QUERY, { search: '' }, null, countries)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <ProjectDetailCountries
          canEdit={false}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <ProjectDetailCountries
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <ProjectDetailCountries
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(COUNTRY_SEARCH_PLACEHOLDER)
    await waitForReactSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <ProjectDetailCountries
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(COUNTRY_SEARCH_PLACEHOLDER)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockCountries]}>
        <ProjectDetailCountries
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(COUNTRY_SEARCH_PLACEHOLDER)

    fireEvent.keyDown(getByTestId(COUNTRY_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(COUNTRY_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(COUNTRY_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_COUNTRY_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(COUNTRY_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await screen.findByText(COUNTRY_SEARCH_PLACEHOLDER)

    expect(screen.queryByText(PROJECT_TEST_COUNTRY_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(COUNTRY_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
