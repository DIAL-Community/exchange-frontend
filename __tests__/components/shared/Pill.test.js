import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import Pill from '../../../components/shared/Pill'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the Pill component.', () => {
  const PILL_TEST_ID = 'pill'
  const PILL_REMOVE_BUTTON_TEST_ID = 'remove-button'

  test('Should match snapshot', () => {
    const { container, getByTestId } = render(<Pill label='test' />)
    expect(container).toMatchSnapshot()
    expect(getByTestId(PILL_TEST_ID)).toHaveTextContent('test')
  })

  test('Should call "onRemove" on "X" click', () => {
    const mockOnRemove = jest.fn()
    const { getByTestId } = render(<Pill onRemove={mockOnRemove} />)
    fireEvent.click(getByTestId(PILL_REMOVE_BUTTON_TEST_ID))
    expect(mockOnRemove).toHaveBeenCalled()
  })
})
