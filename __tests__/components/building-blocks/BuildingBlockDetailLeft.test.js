import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import BuildingBlockDetailLeft from '../../../components/building-blocks/BuildingBlockDetailLeft'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { buildingBlock } from './data/BuildingBlockForm'

mockNextUseRouter()
describe('Unit test for the BuildingBlockDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })
    const { queryByTestId } = render(
      <CustomMockedProvider>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to buildingBlock edit form', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })

    const { getByTestId } = render(
      <CustomMockedProvider>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/building_blocks/${buildingBlock.slug}/edit`)
  })
})
