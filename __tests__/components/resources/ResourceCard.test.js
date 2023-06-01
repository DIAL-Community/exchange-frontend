import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import ResourceCard from '../../../components/resources/ResourceCard'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { resource } from './data/ResourceDetail'

mockNextUseRouter()
describe('Unit test for the ResourceCard component', () => {
  const CARD_TEST_ID = 'resource-card'

  describe('Should match snapshot -', () => {
    test('should render resource card.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { isAdminUser: false })
      const { container, getByTestId } = render(
        <CustomMockedProvider>
          <ResourceCard resource={resource} />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Resource')
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Visit Resource')
      expect(container).toMatchSnapshot()
    })
  })
})
