import { act } from 'react-dom/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockObserverImplementation, waitForAllEffects, render } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import SectorForm from '../../../components/sectors/SectorForm'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { sectors, sectorWithoutParentSector, sectorWithParentSector } from './data/SectorDetail'

mockNextUseRouter()
describe('Unit tests for the SectorForm component.', () => {
  const DIALOG_FORM_TEST_ID = 'dialog'
  const SECTOR_NAME_TEST_ID = 'sector-name'
  const SECTOR_LOCALE_TEST_ID = 'sector-locale'
  const REQUIRED_FIELD_MESSAGE = 'This field is required'
  const mockedSectors = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)
  const mockOnClose = jest.fn()

  beforeAll(() => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot -', () => {
    test('create.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockedSectors]}>
          <SectorForm
            isOpen={true}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(1000)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })

    test('edit for sector which has parent sector.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockedSectors]}>
          <SectorForm
            isOpen={true}
            onClose={mockOnClose}
            sector={sectorWithParentSector}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(100)
      expect(getByTestId(DIALOG_FORM_TEST_ID)).toMatchSnapshot()
    })

    test('edit for which does not have parent sector.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockedSectors]}>
          <SectorForm
            isOpen={true}
            onClose={mockOnClose}
            sector={sectorWithoutParentSector}
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
        <CustomMockedProvider mocks={[mockedSectors]}>
          <SectorForm
            isOpen={true}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(SECTOR_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
      expect(getByTestId(SECTOR_LOCALE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })

    test('should show validation errors and hide one of them on input value change.', async () => {
      const user = userEvent.setup()
      const { getByTestId, getByText } = render(
        <CustomMockedProvider mocks={[mockedSectors]}>
          <SectorForm
            isOpen={true}
            onClose={mockOnClose}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      await act(async () => fireEvent.click(getByText('Submit')))
      expect(getByTestId(SECTOR_NAME_TEST_ID)).toHaveTextContent(REQUIRED_FIELD_MESSAGE)
      expect(getByTestId(SECTOR_LOCALE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)

      await user.type(screen.getByLabelText(/Name/), 'test sector name')
      expect(getByTestId(SECTOR_NAME_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
      expect(getByTestId(SECTOR_LOCALE_TEST_ID)).not.toHaveTextContent(REQUIRED_FIELD_MESSAGE)
    })
  })
})
