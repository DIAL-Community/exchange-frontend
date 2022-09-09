import { mockRouterImplementation, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import RubricCategoryDetail from '../../../components/rubric-categories/RubricCategoryDetail'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { rubricCategory } from './data/RubricCategory'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the RubricCategoryDetail component.', () => {

  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, { slug: 'rc_name' }, null, rubricCategory)

  beforeAll(mockRouterImplementation)

  test('Should render RubricCategoryDetail component', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockRubricCategory]}>
        <RubricCategoryDetail slug='rc_name'/>
      </CustomMockedProvider>
    )

    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })
})
