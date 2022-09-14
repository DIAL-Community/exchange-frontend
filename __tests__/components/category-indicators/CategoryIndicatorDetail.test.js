import { mockRouterImplementation, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import CategoryIndicatorDetail from '../../../components/category-indicators/CategoryIndicatorDetail'
import { CATEGORY_INDICATOR_QUERY } from '../../../queries/category-indicator'
import { categoryIndicator } from './data/CategoryIndicatorDetail'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the CategoryIndicatorDetail component.', () => {
  const mockCategoryIndicator = generateMockApolloData(CATEGORY_INDICATOR_QUERY, { slug: 'test_category_indicator' }, null, categoryIndicator)

  beforeAll(mockRouterImplementation)

  test('Should render CategoryIndicatorDetail component', async () => {
    const { container } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicator]}>
        <CategoryIndicatorDetail slug='test_category_indicator'/>
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    expect(container).toMatchSnapshot()
  })
})
