import { fireEvent, screen } from '@testing-library/react'
import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { TAGS_SEARCH_QUERY } from '../../../queries/tags'
import ProjectDetailTags from '../../../components/projects/ProjectDetailTags'
import { tags } from './data/ProjectDetailTags'
import { project } from './data/ProjectForm'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the ProductDetailTags component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const TAGS_SEARCH_TEST_ID = 'tag-search'
  const TAGS_SEARCH_OPTION_LABEL = 'Another Tag'
  const PROJECT_TEST_TAGS_LABEL = 'Test Tag'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockTags = generateMockApolloData(TAGS_SEARCH_QUERY, { search: '' }, null, tags)

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should match snapshot - without edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <ProjectDetailTags
          canEdit={false}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with edit permission.', () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <ProjectDetailTags
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with open editable section', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <ProjectDetailTags
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <ProjectDetailTags
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(screen.queryByTestId(PILL_TEST_ID)).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('Should add a pill and revert changes on "Cancel" button click', async () => {
    const { container, getByTestId, getByText } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <ProjectDetailTags
          canEdit={true}
          project={project}
        />
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(TAGS_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(TAGS_SEARCH_OPTION_LABEL)
    fireEvent.click(getByText(TAGS_SEARCH_OPTION_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)
    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PROJECT_TEST_TAGS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TAGS_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PROJECT_TEST_TAGS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TAGS_SEARCH_OPTION_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
