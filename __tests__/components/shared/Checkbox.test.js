import { render, fireEvent } from '@testing-library/react'
import { Checkbox } from '../../../components/shared/Checkbox'

describe('Unit test for the Checkbox component.', () => {
  const TEST_ID = 'checkbox'

  test('Should match snapshot - unchecked.', () => {
    const input = render(<Checkbox value='false' />).getByTestId(TEST_ID)
    expect(input).toMatchSnapshot()
  })

  test('Should match snapshot - checked.', () => {
    const input = render(<Checkbox value='true' />).getByTestId(TEST_ID)
    expect(input).toMatchSnapshot()
  })

  test('Should check and call onChange function.', () => {
    const onChange = jest.fn()
    const input = render(<Checkbox value='false' onChange={onChange} />).getByTestId(TEST_ID)
    fireEvent.click(input)
    expect(onChange).toBeCalledTimes(1)
    expect(input).toBeChecked()
  })
})
