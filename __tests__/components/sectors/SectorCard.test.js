import { render } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import SectorCard from '../../../components/sectors/SectorCard'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { sectorWithParentSector } from './data/SectorDetail'

mockNextUseRouter()
describe('Unit test for the SectorCard component', () => {
  const CARD_TEST_ID = 'sector-card'
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const DELETE_BUTTON_TEST_ID = 'delete-button'

  describe('Should match snapshot -', () => {
    test('user is not an admin, displayEditButtons not passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <SectorCard sector={sectorWithParentSector} />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Sector')
      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is not an admin, displayEditButtons passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: false })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <SectorCard
            sector={sectorWithParentSector}
            displayEditButtons
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Sector')
      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is an admin, displayEditButtons not passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <SectorCard sector={sectorWithParentSector} />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Sector')
      expect(queryByTestId(EDIT_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(queryByTestId(DELETE_BUTTON_TEST_ID)).not.toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    test('user is an admin, displayEditButtons passed.', () => {
      mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
      const { container, getByTestId } = render(
        <CustomMockedProvider>
          <SectorCard
            sector={sectorWithParentSector}
            displayEditButtons
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Sector')
      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
      expect(getByTestId(DELETE_BUTTON_TEST_ID)).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
