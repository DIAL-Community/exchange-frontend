import { screen, waitFor } from '@testing-library/react'
import { FilterContextProvider } from '../../../components/context/FilterContext'
import { PlaybookFilterProvider } from '../../../components/context/PlaybookFilterContext'
import PlaybookListQuery from '../../../components/playbooks/PlaybookList'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffects } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { PLAYBOOKS_QUERY } from '../../../queries/playbook'
import { searchPlaybooks } from './data/PlaybookList'

const NEXT_IMAGE_CUSTOM_PROPS = ['src', 'srcset', 'sizes']

describe('Unit tests for playbook list interaction.', () => {
  const eventsOnSpy = jest.fn()
  beforeAll(() => {
    mockNextUseRouter({ events: { on: eventsOnSpy } })
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
    await waitForAllEffects()
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
    await waitFor(() => {
      NEXT_IMAGE_CUSTOM_PROPS.forEach(prop => {
        expect(screen.getByTestId(`playbook-card-image-${searchPlaybooks.data.searchPlaybooks.nodes?.[0]?.id}`)).toHaveAttribute(prop)
      })
    })
    // Each section in the playbook detail should not show any error.
    expect(screen.queryByText(/Error fetching data/)).toBeNull()
    expect(screen.getByText('CDR Analytics for COVID-19 with FlowKit')).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
})
