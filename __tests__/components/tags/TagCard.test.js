import { mockRouterImplementation, mockSessionImplementation, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import TagCard from '../../../components/tags/TagCard'
import { tag } from './data/TagCard'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the TagCard component', () => {
  const CARD_TEST_ID = 'tag-card'
  const DELETE_BUTTON_TEST_ID = 'delete-button'

  beforeAll(() => {
    mockRouterImplementation()
  })

  describe('Should match snapshot -', () => {
    test('user is NOT an admin, displayEditButtons not passed.', () => {
      mockSessionImplementation()
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
      mockSessionImplementation()
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
      mockSessionImplementation(true)
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
      mockSessionImplementation(true)
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
