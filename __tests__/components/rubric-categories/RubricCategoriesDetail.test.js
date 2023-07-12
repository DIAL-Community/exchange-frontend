import { render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import RubricCategoryDetail from '../../../components/rubric-categories/RubricCategoryDetail'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { CATEGORY_INDICATORS_SEARCH_QUERY } from '../../../queries/category-indicator'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { rubricCategory } from './data/RubricCategoryDetail'

mockNextUseRouter()
describe('Unit test for the RubricCategoryDetail component.', () => {
  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, { slug: 'rc_name' }, null, rubricCategory)

  const indicatorData = { data: { categoryIndicators: [] } }
  const mockIndicators = generateMockApolloData(CATEGORY_INDICATORS_SEARCH_QUERY, { search: '' }, null, indicatorData)

  test('Should render RubricCategoryDetail component', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: true })
    const { container, getByText } = render(
      <CustomMockedProvider mocks={[mockRubricCategory, mockIndicators]}>
        <RubricCategoryDetail slug='rc_name'/>
      </CustomMockedProvider>
    )

    await waitForAllEffects()
    expect(getByText('RC name')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
