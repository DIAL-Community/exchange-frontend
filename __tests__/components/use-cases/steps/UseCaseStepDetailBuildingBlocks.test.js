import { fireEvent, screen } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { waitForAllEffectsAndSelectToLoad,  render } from '../../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../../utils/CustomMockedProvider'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../../queries/building-block'
import UseCaseStepDetailBuildingBlocks from '../../../../components/use-cases/steps/UseCaseStepDetailBuildingBlocks'
import { mockNextUseRouter } from '../../../utils/nextMockImplementation'
import { buildingBlocks } from './data/UseCaseStepDetailBuildingBlocks'
import { useCaseStep, useCase } from './data/UseCaseStepForm'

mockNextUseRouter()
describe('Unit tests for the UseCaseStepDetailBuildingBlocks component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const CANCEL_BUTTON_TEST_ID = 'cancel-button'
  const BUILDING_BLOCK_SEARCH_TEST_ID = 'building-block-search'
  const BUILDING_BLOCK_SEARCH_OPTION_1_LABEL = 'Building Block 1'
  const BUILDING_BLOCK_SEARCH_OPTION_2_LABEL = 'Building Block 2'
  const PRODUCT_TEST_BUILDING_BLOCK_LABEL = 'Test Building Block'
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'
  const mockBuildingBlocks = generateMockApolloData(BUILDING_BLOCK_SEARCH_QUERY, { search: '' }, null, buildingBlocks)

  describe('Should match snapshot -', () => {
    test('without edit permission.', () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockBuildingBlocks]}>
          <DndProvider backend={HTML5Backend}>
            <UseCaseStepDetailBuildingBlocks
              canEdit={false}
              useCase={useCase}
              useCaseStep={useCaseStep}
            />
          </DndProvider>
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('with edit permission.', () => {
      const { container } = render(
        <CustomMockedProvider mocks={[mockBuildingBlocks]}>
          <DndProvider backend={HTML5Backend}>
            <UseCaseStepDetailBuildingBlocks
              canEdit={true}
              useCase={useCase}
              useCaseStep={useCaseStep}
            />
          </DndProvider>
        </CustomMockedProvider>
      )
      expect(container).toMatchSnapshot()
    })

    test('with open editable section', async () => {
      const { container, getByTestId } = render(
        <CustomMockedProvider mocks={[mockBuildingBlocks]}>
          <DndProvider backend={HTML5Backend}>
            <UseCaseStepDetailBuildingBlocks
              canEdit={true}
              useCase={useCase}
              useCaseStep={useCaseStep}
            />
          </DndProvider>
        </CustomMockedProvider>
      )
      fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
      await waitForAllEffectsAndSelectToLoad(container)
      expect(container).toMatchSnapshot()
    })
  })

  test('Should remove a pill', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockBuildingBlocks]}>
        <DndProvider backend={HTML5Backend}>
          <UseCaseStepDetailBuildingBlocks
            canEdit={true}
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </DndProvider>
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
      <CustomMockedProvider mocks={[mockBuildingBlocks]}>
        <DndProvider backend={HTML5Backend}>
          <UseCaseStepDetailBuildingBlocks
            canEdit={true}
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </DndProvider>
      </CustomMockedProvider>
    )
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    fireEvent.keyDown(getByTestId(BUILDING_BLOCK_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(BUILDING_BLOCK_SEARCH_OPTION_1_LABEL)
    fireEvent.click(getByText(BUILDING_BLOCK_SEARCH_OPTION_1_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(2)

    fireEvent.keyDown(getByTestId(BUILDING_BLOCK_SEARCH_TEST_ID).childNodes[1], { key: 'ArrowDown' })
    await screen.findByText(BUILDING_BLOCK_SEARCH_OPTION_2_LABEL)
    fireEvent.click(getByText(BUILDING_BLOCK_SEARCH_OPTION_2_LABEL))
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(3)

    expect(container).toMatchSnapshot()

    fireEvent.click(getByTestId(CANCEL_BUTTON_TEST_ID))
    expect(screen.queryByText(PRODUCT_TEST_BUILDING_BLOCK_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(BUILDING_BLOCK_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(BUILDING_BLOCK_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()

    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    await waitForAllEffectsAndSelectToLoad(container)

    expect(screen.queryByText(PRODUCT_TEST_BUILDING_BLOCK_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(BUILDING_BLOCK_SEARCH_OPTION_1_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByText(BUILDING_BLOCK_SEARCH_OPTION_2_LABEL)).not.toBeInTheDocument()
    expect(screen.queryAllByTestId(PILL_TEST_ID)).toHaveLength(1)
  })
})
