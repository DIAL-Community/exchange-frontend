import { fireEvent, screen } from '@testing-library/react'
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
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { TAG_SEARCH_QUERY } from '../../../queries/tag'
import { playbook, play, createPlaySuccess } from './data/PlayForm'
import { buildingBlocks } from './data/PlayBuildingBlocks'
import { products } from './data/PlayProducts'
import { tags } from './data/PlayTags'

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
    productSlugs: ['product_1', 'product_2'],
    buildingBlockSlugs: ['bb_1', 'bb_2']
  }

  const mockTags = generateMockApolloData(TAG_SEARCH_QUERY, { search: '' }, null, tags)
  const mockProducts = generateMockApolloData(PRODUCT_SEARCH_QUERY, { search: '' }, null, products)
  const mockBuildingBlocks = generateMockApolloData(BUILDING_BLOCK_SEARCH_QUERY, { search: '' }, null, buildingBlocks)

  const PlayAndMoveProviders = ({ children }) => (
    <PlayListProvider>
      <PlayFilterProvider>
        {children}
      </PlayFilterProvider>
    </PlayListProvider>
  )

  describe('Should match snapshot', () => {
    test('Create.', async () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockTags, mockProducts, mockBuildingBlocks]}>
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
        <CustomMockedProvider mocks={[mockTags, mockProducts, mockBuildingBlocks]}>
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
      <CustomMockedProvider mocks={[mockTags, mockProducts, mockBuildingBlocks]}>
        <PlayAndMoveProviders>
          <PlayForm playbook={playbook}/>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await user.type(screen.getByLabelText(/Name/), 'test playbook name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should show validation errors for mandatory fields and hide them on input value change.', async () => {
    const user = userEvent.setup()
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockTags, mockProducts, mockBuildingBlocks]}>
        <PlayAndMoveProviders>
          <PlayForm playbook={playbook}/>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await user.type(screen.getByLabelText(/Name/), 'test play name')
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(getByTestId(PLAYBOOK_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    expect(getByTestId(PLAYBOOK_DESCRIPTION_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  })

  test('Should display success toast on submit.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const mockCreatePlay = generateMockApolloData(
      CREATE_PLAY,
      mockCreatePlayVariables,
      null,
      createPlaySuccess
    )
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockCreatePlay, mockTags, mockProducts, mockBuildingBlocks]}>
        <PlayAndMoveProviders>
          <DndProvider backend={HTML5Backend}>
            <PlayForm playbook={playbook} play={play}/>
          </DndProvider>
        </PlayAndMoveProviders>
      </CustomMockedProvider>
    )
    await waitForAllEffectsAndSelectToLoad(container)

    await act(() => fireEvent.submit(getByTestId(SUBMIT_BUTTON_TEST_ID)))
    expect(screen.queryByText('Play saved.')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
