import { fireEvent } from '@testing-library/react'
import CreateButton from '../../../components/shared/CreateButton'
import { mockRouterImplementation, render } from '../../test-utils'

// Mock next-router calls.
jest.mock('next/dist/client/router')

describe('Unit test for the CreateButton component.', () => {
  const CREATE_BUTTON_TEST_ID = 'create-button'
  const CREATE_LINK_TEST_ID = 'create-link'
  const CREATE_BUTTON_LABEL = 'Create'

  beforeAll(mockRouterImplementation)

  test('Should match snapshot - type === "button".', () => {
    const { container, queryByTestId } = render(<CreateButton label={CREATE_BUTTON_LABEL}/>)
    expect(container).toMatchSnapshot()
    expect(queryByTestId(CREATE_BUTTON_TEST_ID)).toHaveProperty('type', 'button')
    expect(queryByTestId(CREATE_BUTTON_TEST_ID)).toHaveTextContent('Create')
    expect(queryByTestId(CREATE_LINK_TEST_ID)).toBeNull()
  })

  test('Should match snapshot - type === "link".', () => {
    const { container, queryByTestId } = render(<CreateButton label={CREATE_BUTTON_LABEL} type='link' href='http://test/' />)
    expect(container).toMatchSnapshot()
    expect(queryByTestId(CREATE_LINK_TEST_ID)).toHaveProperty('href', 'http://test/')
    expect(queryByTestId(CREATE_LINK_TEST_ID)).toHaveTextContent('Create')
    expect(queryByTestId(CREATE_BUTTON_TEST_ID)).toBeNull()
  })

  test('Should call "onClick" on "Create" button click - type === "button".', () => {
    const mockOnClick = jest.fn()
    const { getByTestId } = render(<CreateButton onClick={mockOnClick}/>)
    fireEvent.click(getByTestId(CREATE_BUTTON_TEST_ID))
    expect(mockOnClick).toBeCalled()
  })
})
