import { render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import BuildingBlockDetailLeft from '../../../components/building-blocks/BuildingBlockDetailLeft'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { COMMENTS_COUNT_QUERY } from '../../../queries/comment'
import { buildingBlock } from './data/BuildingBlockForm'

mockNextUseRouter()
describe('Unit test for the BuildingBlockDetailLeft component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-link'

  const commentVars = { commentObjectId: 1, commentObjectType:'BUILDING_BLOCK' }
  const commentData = { 'data': { 'countComments': 0 } }
  const mockComment = generateMockApolloData(COMMENTS_COUNT_QUERY, commentVars, null, commentData)

  test('Should Edit button not be visible for user without admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: false })
    const { queryByTestId } = render(
      <CustomMockedProvider mocks={[mockComment]}>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should Edit button be visible for user with admin or edit privileges', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })

    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockComment]}>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
  })

  test('Should redirect to buildingBlock edit form', () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })

    const { getByTestId } = render(
      <CustomMockedProvider mocks={[mockComment]}>
        <BuildingBlockDetailLeft buildingBlock={buildingBlock} />
      </CustomMockedProvider>
    )

    expect(getByTestId(EDIT_BUTTON_TEST_ID)).toHaveAttribute('href', `/building_blocks/${buildingBlock.slug}/edit`)
  })
})
