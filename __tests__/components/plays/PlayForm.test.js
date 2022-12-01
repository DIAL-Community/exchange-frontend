import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { render, waitForAllEffectsAndSelectToLoad } from '../../test-utils'
import { PlayForm } from '../../../components/plays/PlayForm'
import { CREATE_PLAY } from '../../../mutations/play'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayFilterProvider } from '../../../components/context/PlayFilterContext'
import { PlayPreviewProvider } from '../../../components/plays/PlayPreviewContext'
import { MoveListProvider } from '../../../components/plays/moves/MoveListContext'
import { MovePreviewProvider } from '../../../components/plays/moves/MovePreviewContext'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { playbook, play, createPlaySuccess } from './data/PlayForm'

mockNextUseRouter()
describe('PlayForm component.', () => {
  const SUBMIT_BUTTON_TEST_ID = 'submit-button'
  const PLAYBOOK_NAME_TEST_ID = 'play-name'
  const PLAYBOOK_DESCRIPTION_TEST_ID = 'play-description'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockCreatePlayVariables = {
    name: 'Play',
    slug: 'play',
    description: 'desc play',
    tags: ['tag_1','tag_2'],
    playbookSlug: playbook.slug,
    productsSlugs: ['product_1', 'product_2'],
    buildingBlocksSlugs: []
  }
  const PlayAndMoveProviders = ({ children }) => (
    <PlayListProvider>
      <PlayFilterProvider>
        <PlayPreviewProvider>
          <MoveListProvider>
            <MovePreviewProvider>
              {children}
            </MovePreviewProvider>
          </MoveListProvider>
        </PlayPreviewProvider>
      </PlayFilterProvider>
    </PlayListProvider>
  )

  describe('Should match snapshot', () => {
    test('Create.', async () => {
      const { container } = render(
        <CustomMockedProvider>
          <PlayAndMoveProviders>
            <PlayForm playbook={playbook}/>
          </PlayAndMoveProviders>
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })

    test('Edit.', async () => {
      const { container } = render(
        <CustomMockedProvider>
          <PlayAndMoveProviders>
            <DndProvider backend={HTML5Backend}>
              <PlayForm playbook={playbook} play={play}/>
            </DndProvider>
          </PlayAndMoveProviders>
        </CustomMockedProvider>
      )
      await waitForAllEffectsAndSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })
  })

  test('Should not show validation errors for mandatory fields.', async () => {
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <PlayAndMoveProviders>
          <PlayForm playbook={playbook}/>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await user.type(screen.getByLabelText(/Name/), 'test playbook name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider>
        <PlayAndMoveProviders>
          <PlayForm playbook={playbook}/>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test play name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    await act(async () => waitFor(() => user.clear(screen.getByLabelText(/Name/))))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test play name 2')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const mockCreatePlay = generateMockApolloData(
      CREATE_PLAY,
      mockCreatePlayVariables,
      null,
      createPlaySuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreatePlay]}>
        <PlayAndMoveProviders>
          <DndProvider backend={HTML5Backend}>
            <PlayForm playbook={playbook} play={play}/>
          </DndProvider>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(async () => {
      fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID))
    })
    await screen.findByText('Play saved.')
    expect(container).toMatchSnapshot()
  })
})
