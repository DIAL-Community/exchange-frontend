import { render, fireEvent } from '@testing-library/react'
import IconButton from '../../../components/shared/IconButton'

describe('Unit test for the IconButton component.', () => {
  const TEST_ID = 'icon-button'
  const ICON = '+'

  test('Should match snapshot.', () => {
    const { container } = render(<IconButton icon={ICON} />)
    expect(container).toMatchSnapshot()
    expect(container).toHaveTextContent(ICON)
  })

  test('Should call onClick function.', () => {
    const onClick = jest.fn()
    const button = render(<IconButton onClick={onClick} />).getByTestId(TEST_ID)
    fireEvent.click(button)
    expect(onClick).toBeCalledTimes(1)
  })
})
