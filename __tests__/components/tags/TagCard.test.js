import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import TagCard from '../../../components/tags/TagCard'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { tag } from './data/TagCard'

mockNextUseRouter()
describe('Unit test for the TagCard component', () => {
  const CARD_TEST_ID = 'tag-card'
  const DELETE_BUTTON_TEST_ID = 'delete-button'

  describe('Should match snapshot -', () => {
    test('user is NOT an admin, displayEditButtons not passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <TagCard
            tag={'Example Tag'}
            listType='list'
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Tag')
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is NOT an admin, displayEditButtons passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <TagCard
            tag={'Example Tag'}
            listType='list'
            displayEditButtons
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Tag')
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is an admin, displayEditButtons not passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <TagCard
            tag={'Example Tag'}
            listType='list'
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Tag')
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is an admin, displayEditButtons passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, getByTestId } = render(
        <CustomMockedProvider>
          <TagCard
            tag={tag}
            listType='list'
            displayEditButtons
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Tag')
      expect(getByTestId(DELETE_BUTTON_TEST_ID)).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
