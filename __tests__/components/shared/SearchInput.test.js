import { render, fireEvent } from '@testing-library/react'
import { SearchInput } from '../../../components/shared/SearchInput'

describe('Unit test for the Search Input component.', () => {
  const TEST_ID = 'search-input'

  test('Should match snapshot - without search icon.', () => {
    const onChange = jest.fn()
    const { container } = render(<SearchInput value='test' onChange={onChange} />)
    expect(container).toMatchSnapshot()
  })

  test('Should match snapshot - with search icon.', () => {
    const onChange = jest.fn()
    const onSearchIconClick = jest.fn()
    const { container } = render(<SearchInput value='test' onChange={onChange} onSearchIconClick={onSearchIconClick} />)
    expect(container).toMatchSnapshot()
  })

  test('Should call onChange function - updated value.', () => {
    const onChange = jest.fn()
    const input = render(<SearchInput value='test' onChange={onChange} />).getByTestId(TEST_ID)
    fireEvent.change(input, { target: { value: 'updated' }})
    expect(onChange).toBeCalledTimes(1)
  })

  test('Should call onChange function - clear.', () => {
    const onChange = jest.fn()
    const clearIconButton = render(<SearchInput value='test' onChange={onChange} />).getByTestId('clear-icon-button')
    fireEvent.click(clearIconButton)
    expect(onChange).toBeCalledTimes(1)
  })

  test('Should call onSearchIconClick function.', () => {
    const onChange = jest.fn()
    const onSearchIconClick = jest.fn()
    const searchIconButton = render(<SearchInput value='test' onChange={onChange} onSearchIconClick={onSearchIconClick} />).getByTestId('search-icon-button')
    fireEvent.click(searchIconButton)
    expect(onSearchIconClick).toBeCalledTimes(1)
  })
})
