import { render, mockObserverImplementation, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import ResourceDetail from '../../../components/resources/ResourceDetail'
import { RESOURCE_DETAIL_QUERY } from '../../../queries/resource'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { resource } from './data/ResourceDetail'

mockNextUseRouter()
describe('Unit test for the ResourceDetail component', () => {
  const resourceVars = { slug: 'example_resource' }
  const resourceData = { data: { resource } }
  const mockResource = generateMockApolloData(RESOURCE_DETAIL_QUERY, resourceVars, null, resourceData)

  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot -', () => {
    test('basic test for resource detail page.', async () => {
      const { container, getByText } = render(
        <CustomMockedProvider mocks={[mockResource]}>
          <ResourceDetail slug={resource.slug} />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(getByText(resource.name)).toBeInTheDocument()
      // Match partial on the url only
      expect(getByText(resource.link, { exact: false })).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
