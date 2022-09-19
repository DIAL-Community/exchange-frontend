import { render, fireEvent } from '@testing-library/react'
import FileUploader from '../../../components/shared/FileUploader'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'

mockNextUseRouter()
describe('Unit test for the FileUploader component.', () => {
  const TEST_ID = 'file-uploader'

  test('Should match snapshot.', () => {
    const { container } = render(<FileUploader />)
    expect(container).toMatchSnapshot()
  })

  test('Should call onChange function.', () => {
    const onChange = jest.fn()
    const input = render(<FileUploader onChange={onChange} />).getByTestId(TEST_ID)
    fireEvent.change(input, 'test-filename')
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
