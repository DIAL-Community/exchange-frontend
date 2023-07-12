import { render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import CategoryIndicatorDetail from '../../../components/category-indicators/CategoryIndicatorDetail'
import { CATEGORY_INDICATOR_QUERY } from '../../../queries/category-indicator'
import { rubricCategory } from '../rubric-categories/data/RubricCategoryDetail'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { categoryIndicator } from './data/CategoryIndicatorDetail'

mockNextUseRouter()
describe('Unit test for the CategoryIndicatorDetail component.', () => {
  const mockCategoryIndicator = generateMockApolloData(
    CATEGORY_INDICATOR_QUERY,
    { slug: 'test_category_indicator' },
    null,
    categoryIndicator
  )

  const mockRubricVars = { slug: 'rc_name' }
  const mockRubricData = rubricCategory
  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, mockRubricVars, null, mockRubricData)

  test('Should render CategoryIndicatorDetail component', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicator, mockRubricCategory]}>
        <CategoryIndicatorDetail rubricCategorySlug='rc_name' categoryIndicatorSlug='test_category_indicator'/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })
})
