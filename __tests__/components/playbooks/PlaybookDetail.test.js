import { fireEvent, screen } from '@testing-library/react'
import { PlaybookDetailProvider } from '../../../components/playbooks/PlaybookDetailContext'
import { MOVE_PREVIEW_QUERY } from '../../../queries/play'
import { PLAYBOOK_PLAYS_QUERY, PLAYBOOK_QUERY } from '../../../queries/playbook'
import PlaybookDetail from '../../../components/playbooks/PlaybookDetail'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { mockObserverImplementation, render, waitForAllEffects } from '../../test-utils'
import { COMMENTS_COUNT_QUERY } from '../../../queries/comment'
import { playbook, searchPlaysResult, move } from './data/PlaybookDetail'

// TODO: https://github.com/tinymce/tinymce-react/issues/91.

const slug = 'example_playbook'
const playSlug = 'd4d_understand_the_problem'
const moveSlug = 'considerations'
jest.mock('../../../components/shared/comment/CommentsSection', () => () => 'CommentsSection')

mockNextUseRouter()
describe('Unit tests for playbook interaction.', () => {
  const commentVars = { 'commentObjectId': 4, 'commentObjectType': 'PLAYBOOK' }
  const commentData = { 'data': { 'countComments': 0 } }
  const mockComment = generateMockApolloData(COMMENTS_COUNT_QUERY, commentVars, null, commentData)

  beforeEach(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  test('Should render error message when the apollo is returning errors.', async () => {
    // Mock all apollo interaction
    const mockPlaybook = generateMockApolloData(PLAYBOOK_QUERY, { slug }, new Error('An error occurred'))
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, new Error('An error occurred'))
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockPlaybook, mockPlays, mockComment]} addTypename={false}>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale='en' />
        </PlaybookDetailProvider>
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects()
    // Each section in the playbook detail should show error.
    expect(screen.getAllByText(/Error fetching data/).length).toEqual(1)
    expect(component).toMatchSnapshot()
  })

  test('Should render playbook data when apollo query returning playbook data.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: false })
    // Mock all apollo interaction
    const mockPlaybook = generateMockApolloData(PLAYBOOK_QUERY, { slug }, null, playbook)
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, null, searchPlaysResult)
    const mockMove = generateMockApolloData(MOVE_PREVIEW_QUERY, { playSlug, slug: moveSlug }, null, move)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockPlaybook, mockPlays, mockMove, mockComment]} addTypename={false}>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale='en' />
        </PlaybookDetailProvider>
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects()

    // Each section in the playbook detail should not show any error.
    const errorMessage = screen.queryByText(/Error fetching data/)
    expect(errorMessage).toBeNull()

    // Playbook detail should render the overview page.
    // expect(screen.getByText('The audience of this playbook is you.')).toBeInTheDocument()
    // expect(screen.getByText('The outcome of this playbook is expected.')).toBeInTheDocument()
    // Playbook detail should render the play as well.
    // expect(screen.getByText('The play description goes here.')).toBeInTheDocument()

    // Playbook detail should not have edit link for unprivileged users.
    const editLink = screen.queryByText(/Edit/)
    expect(editLink).toBeNull()

    await waitForAllEffects()

    // Expect this to match existing snapshot of the page.
    expect(component).toMatchSnapshot()
  })

  test('Privileged user should be able to edit the playbook.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    // Mock all apollo interaction
    const mockPlaybook = generateMockApolloData(PLAYBOOK_QUERY, { slug }, null, playbook)
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, null, searchPlaysResult)
    const mockMove = generateMockApolloData(MOVE_PREVIEW_QUERY, { playSlug, slug: moveSlug }, null, move)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockPlaybook, mockPlays, mockMove, mockComment]} addTypename={false}>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale='en' />
        </PlaybookDetailProvider>
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects()
    // Playbook detail should have edit link for privileged users.
    const [playbookEditButton, playEditButton] = screen.getAllByText('Edit')
    expect(playbookEditButton).toBeInTheDocument()
    expect(playbookEditButton.closest('a')).toHaveAttribute('href', `/en/playbooks/${slug}/edit`)

    expect(playEditButton.closest('a'))
      .toHaveAttribute('href', `/en/playbooks/${slug}/plays/d4d_understand_the_problem/edit`)

    fireEvent.click(playbookEditButton)

    // Expect this to match existing snapshot of the page.
    expect(component).toMatchSnapshot()
  })
})
