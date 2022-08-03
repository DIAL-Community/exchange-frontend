import {
  mockObserverImplementation,
  mockRouterImplementation,
  waitForAllEffects,
  render
} from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import SectorDetail from '../../../components/sectors/SectorDetail'
import { SECTOR_SEARCH_QUERY } from '../../../queries/sector'
import { sectors, sectorWithoutParentSector, sectorWithParentSector } from './data/SectorDetail'

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')


describe('Unit test for the SectorDetail component', () => {
  const SECTOR_DETAIL_TEST_ID = 'sector-detail'
  const SECTOR_NAME_TEST_ID = 'sector-name'
  const PARENT_SECTOR_TEST_ID = 'parent-sector'
  const SECTOR_LOCALE_TEST_ID = 'sector-locale'
  const mockOnClose = jest.fn()
  const mockSectorList = generateMockApolloData(SECTOR_SEARCH_QUERY, { search: '', locale: 'en' }, null, sectors)

  beforeAll(() => {
    mockRouterImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })
  
  describe('Should match snapshot -', () => {
    test('for sector with parent sector.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider mocks={[mockSectorList]}>
          <SectorDetail
            isOpen={true}
            onClose={mockOnClose}
            sector={sectorWithParentSector}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects(SECTOR_DETAIL_TEST_ID)
      expect(getByTestId(SECTOR_NAME_TEST_ID)).toHaveTextContent(sectorWithParentSector.name)
      expect(getByTestId(PARENT_SECTOR_TEST_ID)).toHaveTextContent('Example Parent Sector')
      expect(getByTestId(SECTOR_LOCALE_TEST_ID)).toHaveTextContent(sectorWithParentSector.locale)
      expect(getByTestId(SECTOR_DETAIL_TEST_ID)).toMatchSnapshot()
    })
  
    test('for sector without parent sector.', () => {
      const { getByTestId, queryByTestId } = render(
        <CustomMockedProvider>
          <SectorDetail
            isOpen={true}
            onClose={mockOnClose}
            sector={sectorWithoutParentSector}
          />
        </CustomMockedProvider>
      )
      expect(getByTestId(SECTOR_NAME_TEST_ID)).toHaveTextContent(sectorWithParentSector.name)
      expect(queryByTestId(PARENT_SECTOR_TEST_ID)).not.toBeInTheDocument()
      expect(getByTestId(SECTOR_LOCALE_TEST_ID)).toHaveTextContent(sectorWithParentSector.locale)
      expect(getByTestId(SECTOR_DETAIL_TEST_ID)).toMatchSnapshot()
    })
  })
})
