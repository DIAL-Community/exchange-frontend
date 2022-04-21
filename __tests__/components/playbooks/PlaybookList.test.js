import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import { PlaybookFilterProvider } from '../../../components/context/PlaybookFilterContext'
import PlaybookListQuery, { PLAYBOOKS_QUERY } from '../../../components/playbooks/PlaybookList'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render } from '../../test-utils'
import { searchPlaybooks } from './data/PlaybookList'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for playbook list interaction.', () => {
  const pushSpy = jest.fn(() => Promise.resolve(true))
  beforeEach(() => {
    // Mocked router implementation.
    useRouter.mockImplementation(() => ({
      asPath: '/',
      locale: 'en',
      push: pushSpy,
      prefetch: jest.fn(() => Promise.resolve(true)),
      events: {
        on: jest.fn(),
        off: jest.fn()
      }
    }))
    // Mocked session implementation.
    const mockSession = {
      expires: '1',
      user: { email: 'a', name: 'Delta', image: 'c' },
    }
    useSession.mockReturnValue([mockSession, false])
  })

  test('Should render error message when apollo returning error.', async () => {
    const variables = { first: 20, search: '', tags: [], products: [] }
    const mockPlaybookList = generateMockApolloData(PLAYBOOKS_QUERY, variables, new Error('An error occurred'))
    const component = render(
      <CustomMockedProvider mocks={[mockPlaybookList]} addTypename={false}>
        <PlaybookFilterProvider>
          <FilterContextProvider>
            <PlaybookListQuery />
          </FilterContextProvider>
        </PlaybookFilterProvider>
      </CustomMockedProvider>
    )

    await waitFor(() => new Promise((res) => setTimeout(res, 0)))
    expect(screen.getAllByText(/Error fetching data/).length).toEqual(1)
    // Ensure we're keeping the snapshot of the current UI.
    // This will throw errors if the UI is changing in the future.
    // That will force us to revisit the unit tests.
    expect(component).toMatchSnapshot()
  })

  test('Should render list of playbooks.', async () => {
    const variables = { first: 20, search: '', tags: [], products: [] }
    const mockPlaybookList = generateMockApolloData(PLAYBOOKS_QUERY, variables, null, searchPlaybooks)
    const component = render(
      <CustomMockedProvider mocks={[mockPlaybookList]} addTypename={false}>
        <PlaybookFilterProvider>
          <FilterContextProvider>
            <PlaybookListQuery />
          </FilterContextProvider>
        </PlaybookFilterProvider>
      </CustomMockedProvider>
    )

    await waitFor(() => new Promise((res) => setTimeout(res, 0)))

    // Each section in the playbook detail should not show any error.
    const errorMessage = screen.queryByText(/Error fetching data/)
    expect(errorMessage).toBeNull()

    const cardAnchor = screen.getByText('CDR Analytics for COVID-19 with FlowKit')
    fireEvent.click(cardAnchor)
    expect(pushSpy.mock.calls.length).toBe(1)
    // See: https://nextjs.org/docs/api-reference/next/router#routerpush
    expect(pushSpy).toHaveBeenCalledWith(
      '/playbooks/cdr_analytics_for_covid19_with_f',
      '/playbooks/cdr_analytics_for_covid19_with_f',
      { 'locale': undefined, 'scroll': undefined, 'shallow': undefined }
    )

    // Ensure we're keeping the snapshot of the current UI.
    // This will throw errors if the UI is changing in the future.
    // That will force us to revisit the unit tests.
    expect(component).toMatchSnapshot()
  })
})
