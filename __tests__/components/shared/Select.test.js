import { render, fireEvent, screen } from '@testing-library/react'
import Select from '../../../components/shared/Select'

describe('Unit test for the Select component.', () => {
  const TEST_ID = 'select'

  test('Should match snapshot.', () => {
    const { container, getByText } = render(<Select placeholder='test' />)
    expect(container).toMatchSnapshot()
    expect(getByText('test')).toBeInTheDocument()
  })

  test('Should match snapshot - async.', async () => {
    const { container, getByText } = render(<Select async={true} placeholder='test' />)
    await screen.findByText('test')
    expect(container).toMatchSnapshot()
    expect(getByText('test')).toBeInTheDocument()
  })

  test('Should match snapshot - search.', () => {
    const { container, getByText } = render(<Select isSearch={true} placeholder='test' />)
    expect(container).toMatchSnapshot()
    expect(getByText('test')).toBeInTheDocument()
  })

  test('Should match snapshot - search async.', async () => {
    const { container, getByText } = render(<Select async={true} isSearch={true} placeholder='test' />)
    await screen.findByText('test')
    expect(container).toMatchSnapshot()
    expect(getByText('test')).toBeInTheDocument()
  })

  test('Should call onChange function.', async () => {
    const onChange = jest.fn()
    const { getByTestId, getByText } = render(
      <div data-testid={TEST_ID}>
        <Select options={[{ label: 'test1', value: 1 }, { label: 'test2', value: 2 }]} onChange={onChange} />
      </div>
    )
    fireEvent.keyDown(getByTestId(TEST_ID).firstChild, { key: 'ArrowDown' })
    await screen.findByText('test1')
    fireEvent.click(getByText('test1'))
    expect(onChange).toBeCalledTimes(1)
  })
})
