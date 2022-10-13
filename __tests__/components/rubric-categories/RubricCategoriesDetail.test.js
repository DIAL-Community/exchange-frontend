import { render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import RubricCategoryDetail from '../../../components/rubric-categories/RubricCategoryDetail'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { rubricCategory } from './data/RubricCategoryDetail'

mockNextUseRouter()
describe('Unit test for the RubricCategoryDetail component.', () => {
  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, { slug: 'rc_name' }, null, rubricCategory)

  test('Should render RubricCategoryDetail component', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockRubricCategory]}>
        <RubricCategoryDetail slug='rc_name'/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    expect(getByTestId('description')).toHaveTextContent('RC description')

    expect(container).toMatchSnapshot()
  })
})
