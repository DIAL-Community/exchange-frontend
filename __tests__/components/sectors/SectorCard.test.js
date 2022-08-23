import { mockRouterImplementation, mockSessionImplementation, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider from '../../utils/CustomMockedProvider'
import SectorCard from '../../../components/sectors/SectorCard'
import { sectorWithParentSector } from './data/SectorDetail'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')

describe('Unit test for the SectorCard component', () => {
  const CARD_TEST_ID = 'sector-card'
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const DELETE_BUTTON_TEST_ID = 'delete-button'

  beforeAll(mockRouterImplementation)

  describe('Should match snapshot -', () => {
    test('user is not an admin, displayEditButtons not passed.', () => {
      mockSessionImplementation()
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
      mockSessionImplementation()
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
      mockSessionImplementation(true)
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
      mockSessionImplementation(true)
      const { container, getByTestId } = render(
        <CustomMockedProvider>
          <SectorCard
            sector={sectorWithParentSector}
            displayEditButtons
          />
        </CustomMockedProvider>
      )
      waitForAllEffects()
      expect(getByTestId(CARD_TEST_ID)).toHaveTextContent('Example Sector')
      expect(getByTestId(EDIT_BUTTON_TEST_ID)).toBeInTheDocument()
      expect(getByTestId(DELETE_BUTTON_TEST_ID)).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })
})
