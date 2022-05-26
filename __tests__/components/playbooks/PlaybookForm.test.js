import { fireEvent, screen, waitFor } from '@testing-library/react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayFilterProvider } from '../../../components/context/PlayFilterContext'
import { PlayPreviewProvider } from '../../../components/plays/PlayPreviewContext'
import { draftPlaybook, publishedPlaybook } from './data/PlaybookForm'

// Mock next-router calls.
jest.mock('next/dist/client/router')
// Mock the next-auth's useSession.
jest.mock('next-auth/client')

describe('Unit tests for PlaybookForm component.', () => {
  const PUBLISHED_CHECKBOX_LABEL = 'Published'
  const PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL = 'Publish Playbook'
  const SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL = 'Save as Draft'

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation()
  })

  test('Should render unchecked "Published" checkbox and "Save as Draft" submit button by default - create Playbook.', async () => {
    const { getByLabelText } = render(
      <CustomMockedProvider>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlayPreviewProvider>
              <PlaybookForm />
            </PlayPreviewProvider>
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitFor(() => {
      expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).not.toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
    })
  })

  test('Should check "Published" checkbox and change submit button label from "Save as Draft" to "Published".', async () => {
    const { getByLabelText } = render(
      <CustomMockedProvider>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlayPreviewProvider>
              <PlaybookForm />
            </PlayPreviewProvider>
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
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
    const { getByLabelText } = render(
      <CustomMockedProvider>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlayPreviewProvider>
              <DndProvider backend={HTML5Backend}>
                <PlaybookForm playbook={draftPlaybook} />
              </DndProvider>
            </PlayPreviewProvider>
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitFor(() => {
      expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).not.toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
    })
  })

  test('Should render checked "Published" checkbox and "Publish Playbook" submit button for published Playbook.', async () => {
    const { getByLabelText } = render(
      <CustomMockedProvider>
        <PlayListProvider>
          <PlayFilterProvider>
            <PlayPreviewProvider>
              <DndProvider backend={HTML5Backend}>
                <PlaybookForm playbook={publishedPlaybook} />
              </DndProvider>
            </PlayPreviewProvider>
          </PlayFilterProvider>
        </PlayListProvider>
      </CustomMockedProvider>
    )
    await waitFor(() => {
      expect(getByLabelText(PUBLISHED_CHECKBOX_LABEL)).toBeChecked()
      expect(screen.queryByText(SAVE_AS_DRAFT_SUBMIT_BUTTON_LABEL)).not.toBeInTheDocument()
      expect(screen.queryByText(PUBLISH_PLAYBOOK_SUBMIT_BUTTON_LABEL)).toBeInTheDocument()
    })
  })
})
