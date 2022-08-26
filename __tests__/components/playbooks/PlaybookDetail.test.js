import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { fireEvent, screen } from '@testing-library/react'
import { PlaybookDetailProvider } from '../../../components/playbooks/PlaybookDetailContext'
import { PLAYBOOK_QUERY as HEADER_QUERY } from '../../../components/playbooks/PlaybookDetailHeader'
import { PLAYBOOK_QUERY as NAVIGATION_QUERY } from '../../../components/playbooks/PlaybookDetailNavigation'
import { PLAYBOOK_QUERY as OVERVIEW_QUERY } from '../../../components/playbooks/PlaybookDetailOverview'
import { PLAYBOOK_PLAYS_QUERY } from '../../../components/playbooks/PlaybookDetailPlayList'
import { MOVE_QUERY } from '../../../components/plays/PlayPreviewMove'
import PlaybookDetail from '../../../components/playbooks/PlaybookDetail'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects } from '../../test-utils'
import { playbook, searchPlaysResult, move } from './data/PlaybookDetail'

const slug = 'example_playbook'
const playSlug = 'd4d_understand_the_problem'
const moveSlug = 'considerations'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for playbook interaction.', () => {
  beforeEach(() => {
    // Mocked router implementation.
    useRouter.mockImplementation(() => ({
      asPath: '/',
      locale: 'en',
      push: jest.fn(() => Promise.resolve(true)),
      prefetch: jest.fn(() => Promise.resolve(true)),
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }))
    // Mocked session implementation.
    const mockSession = {
      user: { canEdit: false }
    }
    useSession.mockReturnValue([mockSession, false])
    // Mock intersection observer. We're using this in the playbook detail page.
    window.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  test('Should render error message when the apollo is returning errors.', async () => {
    // Mock all apollo interaction
    const mockNavigation = generateMockApolloData(NAVIGATION_QUERY, { slug }, new Error('An error occurred'))
    const mockHeader = generateMockApolloData(HEADER_QUERY, { slug }, new Error('An error occurred'))
    const mockOverview = generateMockApolloData(OVERVIEW_QUERY, { slug }, new Error('An error occurred'))
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, new Error('An error occurred'))
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockNavigation, mockHeader, mockOverview, mockPlays]} addTypename={false}>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale='en' />
        </PlaybookDetailProvider>
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects()
    // Each section in the playbook detail should show error.
    expect(screen.getAllByText(/Error fetching data/).length).toEqual(4)
    expect(component).toMatchSnapshot()
  })

  test('Should render playbook data when apollo query returning playbook data.', async () => {
    // Mock all apollo interaction
    const mockNavigation = generateMockApolloData(NAVIGATION_QUERY, { slug }, null, playbook)
    const mockHeader = generateMockApolloData(HEADER_QUERY, { slug }, null, playbook)
    const mockOverview = generateMockApolloData(OVERVIEW_QUERY, { slug }, null, playbook)
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, null, searchPlaysResult)
    const mockMove = generateMockApolloData(MOVE_QUERY, { playSlug, slug: moveSlug }, null, move)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockNavigation, mockHeader, mockOverview, mockPlays, mockMove]} addTypename={false}>
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
    expect(screen.getByText('Just an example of playbook.')).toBeInTheDocument()
    expect(screen.getByText('The audience of this playbook is you.')).toBeInTheDocument()
    expect(screen.getByText('The outcome of this playbook is expected.')).toBeInTheDocument()
    // Playbook detail should render the play as well.
    expect(screen.getByText('The play description goes here.')).toBeInTheDocument()

    // Playbook detail should not have edit link for unprivileged users.
    const editLink = screen.queryByText(/Edit/)
    expect(editLink).toBeNull()

    await waitForAllEffects()

    // Expect this to match existing snapshot of the page.
    expect(component).toMatchSnapshot()
  })

  test('Privileged user should be able to edit the playbook.', async () => {
    const mockSession = {
      user: { canEdit: true }
    }
    useSession.mockReturnValue([mockSession, false])
    // Mock all apollo interaction
    const mockNavigation = generateMockApolloData(NAVIGATION_QUERY, { slug }, null, playbook)
    const mockHeader = generateMockApolloData(HEADER_QUERY, { slug }, null, playbook)
    const mockOverview = generateMockApolloData(OVERVIEW_QUERY, { slug }, null, playbook)
    const mockPlays = generateMockApolloData(PLAYBOOK_PLAYS_QUERY, { first: 10, slug }, null, searchPlaysResult)
    const mockMove = generateMockApolloData(MOVE_QUERY, { playSlug, slug: moveSlug }, null, move)
    // Render the component and use screen to check them.
    const component = render(
      <CustomMockedProvider mocks={[mockNavigation, mockHeader, mockOverview, mockPlays, mockMove]} addTypename={false}>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale='en' />
        </PlaybookDetailProvider>
      </CustomMockedProvider>
    )
    // Wait for all effect to be executed.
    await waitForAllEffects()
    // Playbook detail should have edit link for privileged users.
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Edit').closest('a')).toHaveAttribute('href', `/en/playbooks/${slug}/edit`)

    fireEvent.click(screen.getByText('Edit'))

    // Expect this to match existing snapshot of the page.
    expect(component).toMatchSnapshot()
  })
})
