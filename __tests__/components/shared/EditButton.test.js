import { fireEvent, screen } from '@testing-library/react'
import EditButton from '../../../components/shared/EditButton'
import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the EditButton component.', () => {
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const EDIT_LINK_TEST_ID = 'edit-link'

  test('Should match snapshot - type === "button".', () => {
    const { container } = render(<EditButton />)
    expect(container).toMatchSnapshot()
    expect(screen.queryByTestId(EDIT_BUTTON_TEST_ID)).toHaveProperty('type', 'button')
    expect(screen.queryByTestId(EDIT_BUTTON_TEST_ID)).toHaveTextContent('Edit')
    expect(screen.queryByTestId(EDIT_LINK_TEST_ID)).toBeNull()
  })

  test('Should match snapshot - type === "link".', () => {
    const { container } = render(<EditButton type='link' href='http://test/' />)
    expect(container).toMatchSnapshot()
    expect(screen.queryByTestId(EDIT_LINK_TEST_ID)).toHaveProperty('href', 'http://test/')
    expect(screen.queryByTestId(EDIT_LINK_TEST_ID)).toHaveTextContent('Edit')
    expect(screen.queryByTestId(EDIT_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should call "onClick" on "Edit" button click - type === "button".', () => {
    const mockOnClick = jest.fn()
    const { getByTestId } = render(<EditButton onClick={mockOnClick}/>)
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    expect(mockOnClick).toHaveBeenCalled()
  })
})
