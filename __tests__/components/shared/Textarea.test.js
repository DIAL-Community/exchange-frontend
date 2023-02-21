import { render, fireEvent } from '@testing-library/react'
import Textarea from '../../../components/shared/Textarea'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()

describe('Unit test for the Textarea component.', () => {
  const TEST_ID = 'test-textarea'
  const mockOnChange = jest.fn()

  describe('Should match snapshot', () =>{
    test('valid.', () => {
      const { container } = render(<Textarea value='test value' placeholder='test placeholder' onChange={mockOnChange} />)
      expect(container).toMatchSnapshot()
    })

    test('invalid.', () => {
      const { container } = render(
        <Textarea value='test value' placeholder='test placeholder' onChange={mockOnChange} isInvalid />
      )
      expect(container).toMatchSnapshot()
    })

    test('10 rows high.', () => {
      const { container } = render(
        <Textarea value='test value' placeholder='test placeholder' onChange={mockOnChange} rows={10} />
      )
      expect(container).toMatchSnapshot()
    })
  })

  test('Should call onChange function.', () => {
    const input = render(<Textarea data-testid={TEST_ID} value='test' onChange={mockOnChange} />).getByTestId(TEST_ID)
    fireEvent.change(input, { target: { value: 'updated' } })
    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })
})
