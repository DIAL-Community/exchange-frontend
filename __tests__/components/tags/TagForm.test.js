import { act } from 'react-dom/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagForm from '../../../components/tags/TagForm'
import {
  mockObserverImplementation,
  mockRouterImplementation,
  mockSessionImplementation,
  waitForAllEffects,
  render
} from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { tag } from './data/TagCard'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit tests for the TagForm component.', () => {
  const DIALOG_FORM_TEST_ID = 'dialog'
  const TAG_NAME_TEST_ID = 'tag-name'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockIsDialogOpen = true
  const mockOnClose = jest.fn()

  beforeAll(() => {
    mockRouterImplementation()
    mockSessionImplementation(true)
    window.IntersectionObserver = mockObserverImplementation()
  })
    
  describe('Should match snapshot -', () => {
    test('create.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <TagForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(500)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })
    
    test('edit.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <TagForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
            tag={tag}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(500)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })
  })
  
  describe('For mandatory field -', () => {
    test('should show validation errors.', async () => {
      const { container, getByTestId, getByText } = render(
        <CustomMockedProvider>
          <TagForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(container)
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(TAG_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })
  
    test('should show validation errors and hide them on input value change.', async () => {
      const user = userEvent.setup()
      const { container, getByTestId, getByText } = render(
        <CustomMockedProvider >
          <TagForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(container)
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(TAG_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
  
      await user.type(screen.getByLabelText(/Name/), 'test tag name')
      expect(getByTestId(TAG_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })
  })
})
