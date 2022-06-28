import { fireEvent } from '@testing-library/react'
import DeleteButton from '../../../components/shared/DeleteButton'
import { mockRouterImplementation, render } from '../../test-utils'

// Mock next-router calls.
jest.mock('next/dist/client/router')

describe('Unit test for the DeleteButton component.', () => {
  const DELETE_BUTTON_TEST_ID = 'delete-button'
  const DELETE_LINK_TEST_ID = 'delete-link'

  beforeAll(mockRouterImplementation)

  test('Should match snapshot - type === "button".', () => {
    const { container, queryByTestId } = render(<DeleteButton />)
    expect(container).toMatchSnapshot()
    expect(queryByTestId(DELETE_BUTTON_TEST_ID)).toHaveProperty('type', 'button')
    expect(queryByTestId(DELETE_BUTTON_TEST_ID)).toHaveTextContent('Delete')
    expect(queryByTestId(DELETE_LINK_TEST_ID)).toBeNull()
  })

  test('Should match snapshot - type === "link".', () => {
    const { container, queryByTestId } = render(<DeleteButton type='link' href='http://test/' />)
    expect(container).toMatchSnapshot()
    expect(queryByTestId(DELETE_LINK_TEST_ID)).toHaveProperty('href', 'http://test/')
    expect(queryByTestId(DELETE_LINK_TEST_ID)).toHaveTextContent('Delete')
    expect(queryByTestId(DELETE_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should call "onClick" on "Delete" button click - type === "button".', () => {
    const mockOnClick = jest.fn()
    const { getByTestId } = render(<DeleteButton onClick={mockOnClick}/>)
    fireEvent.click(getByTestId(DELETE_BUTTON_TEST_ID))
    expect(mockOnClick).toBeCalled()
  })
})
