import { act } from 'react-dom/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CountryForm from '../../../components/countries/CountryForm'
import { mockObserverImplementation, waitForAllEffects, render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { country } from './data/CountryForm'

mockNextUseRouter()
describe('Unit tests for the CountryForm component.', () => {
  const DIALOG_FORM_TEST_ID = 'dialog'
  const COUNTRY_NAME_TEST_ID = 'country-name'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockIsDialogOpen = true
  const mockOnClose = jest.fn()

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot -', () => {
    test('create.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <CountryForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(100)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })

    test('edit.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <CountryForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
            country={country}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(100)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })
  })

  describe('For mandatory field -', () => {
    test('should show validation errors.', async () => {
      const { getByTestId, getByText } = render(
        <CustomMockedProvider>
          <CountryForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(COUNTRY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })

    test('should show validation errors and hide them on input value change.', async () => {
      const user = userEvent.setup()
      const { getByTestId, getByText } = render(
        <CustomMockedProvider >
          <CountryForm
            isOpen={mockIsDialogOpen}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(COUNTRY_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)

      await user.type(screen.getByLabelText(/Name/), 'Country')
      expect(getByTestId(COUNTRY_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })
  })
})
