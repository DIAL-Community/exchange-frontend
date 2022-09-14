import { mockRouterImplementation, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import RubricCategoryDetail from '../../../components/rubric-categories/RubricCategoryDetail'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { rubricCategory } from './data/RubricCategoryDetail'

jest.mock('next/dist/client/router')

describe('Unit test for the RubricCategoryDetail component.', () => {
  const mockRubricCategory = generateMockApolloData(RUBRIC_CATEGORY_QUERY, { slug: 'rc_name' }, null, rubricCategory)

  beforeAll(mockRouterImplementation)

  test('Should render RubricCategoryDetail component', async () => {
    const { container, getByTestId } = render(
      <CustomMockedProvider mocks={[mockRubricCategory]}>
        <RubricCategoryDetail slug='rc_name'/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()

    expect(getByTestId('description')).toHaveTextContent('RC description')
    expect(getByTestId('indicators')).toHaveTextContent('CI name')

    expect(container).toMatchSnapshot()
  })
})
