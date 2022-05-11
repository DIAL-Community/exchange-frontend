import { render, fireEvent } from '@testing-library/react'
import Checkbox from '../../../components/shared/Checkbox'

describe('Unit test for the Checkbox component.', () => {
  const TEST_ID = 'checkbox'

  test('Should match snapshot - unchecked.', () => {
    const onChange = jest.fn()
    const input = render(<Checkbox value={false} onChange={onChange} />).getByTestId(TEST_ID)
    expect(input).toMatchSnapshot()
    expect(input).not.toBeChecked()
  })

  test('Should match snapshot - checked.', () => {
    const onChange = jest.fn()
    const input = render(<Checkbox value={true} onChange={onChange} />).getByTestId(TEST_ID)
    expect(input).toMatchSnapshot()
    expect(input).toBeChecked()
  })

  test('Should call onChange function.', () => {
    const onChange = jest.fn()
    const input = render(<Checkbox value={false} onChange={onChange} />).getByTestId(TEST_ID)
    fireEvent.click(input)
    expect(onChange).toBeCalledTimes(1)
  })
})
