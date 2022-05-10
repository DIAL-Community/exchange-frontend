import { render, fireEvent } from '@testing-library/react'
import { Input } from '../../../components/shared/Input'

describe('Unit test for the Input component.', () => {
  const TEST_ID = 'test-input'

  test('Should match snapshot.', () => {
    const onChange = jest.fn()
    const { container } = render(<Input value='test' onChange={onChange} />)
    expect(container).toMatchSnapshot()
  })

  test('Should call onChange function.', () => {
    const onChange = jest.fn()
    const input = render(<Input data-testid={TEST_ID} value='test' onChange={onChange} />).getByTestId(TEST_ID)
    fireEvent.change(input, { target: { value: 'updated' }})
    expect(onChange).toBeCalledTimes(1)
  })
})
