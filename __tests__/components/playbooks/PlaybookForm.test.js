import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayFilterProvider } from '../../../components/context/PlayFilterContext'
import { CREATE_PLAYBOOK } from '../../../mutations/playbook'
import { TAG_SEARCH_QUERY } from '../../../queries/tag'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { createPlaybookSuccess, draftPlaybook, publishedPlaybook, testPlaybook } from './data/PlaybookForm'
import { tags } from './data/PlaybookTags'

mockNextUseRouter()
describe('Unit tests for PlaybookForm component.', () => {
  const PUBLISHED_CHECKBOX_LABEL = 'Published'
  const PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL = 'Publish Playbook'
  const SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL = 'Save as Draft'
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const PLAYBOOK_NAME_TEST_ID = 'playbook-name'
  const PLAYBOOK_OVERVIEW_TEST_ID = 'playbook-overview'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'

  const mockTags = generateMockApolloData(TAG_SEARCH_QUERY, { search: '' }, null, tags)

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED)
  })

  test('Should match snapshot - create.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - edit.', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm playbook={draftPlaybook} />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    expect(container).toMatchSnapshot()
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await user.type(screen.getByLabelText(/Name/), 'test playbook name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_OVERVIEW_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_OVERVIEW_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_OVERVIEW_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test playbook name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await user.clear(screen.getByLabelText(/Name/))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test playbook name 2')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_OVERVIEW_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    const mockCreatePlaybook = generateMockApolloData(
      CREATE_PLAYBOOK,
      {
        name: 'Test Playbook',
        slug: 'test_playbook',
        author: 'Test Playbook Author',
        overview: 'Test Playbook Overview',
        audience: '',
        outcomes: '',
        tags: [],
        draft: true
      },
      null,
      createPlaybookSuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreatePlaybook, mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm playbook={testPlaybook} />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    await screen.findByText('Playbook submitted.')
    expect(container).toMatchSnapshot()
  })

  test(
    'Should render unchecked "Published" checkbox and "Save as Draft" submit button by default - create Playbook.',
    async () => {
      const { container, getByLabelText } = render(
        <CustomMockedProvider mocks={[mockTags]}>
          <PlayListProvider>
            <PlayFilterProvider>
              <PlaybookForm />
            </PlayFilterProvider>
          </PlayListProvider>
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      await waitFor(() => {
        expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).not.toBeChecked()
        expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
        expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
      })
    }
  )

  test('Should check "Published" checkbox and change submit button label from "Save as Draft" to "Published".', async () => {
    const { container, getByLabelText } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await waitFor(() => {
      const checkbox = getByLabelText(PUBLISHED_CHECKBOX_LABEL)

      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()

      fireEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
    })
  })

  test('Should render unchecked "Published" checkbox and "Save as Draft" submit button for draft Playbook.', async () => {
    const { container, getByLabelText } = render(
      <CustomMockedProvider mocks={[mockTags]}>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlaybookForm playbook={draftPlaybook} />
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)
    await waitFor(() => {
      expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).not.toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
    })
  })

  test(
    'Should render checked "Published" checkbox and "Publish Playbook" submit button for published Playbook.',
    async () => {
      const { container, getByLabelText } = render(
        <CustomMockedProvider mocks={[mockTags]}>
          <PlayListProvider>
            <PlayFilterProvider>
              <PlaybookForm playbook={publishedPlaybook} />
            </PlayFilterProvider>
          </PlayListProvider>
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      await waitFor(() => {
        expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).toBeChecked()
        expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
        expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
      })
    }
  )
})
