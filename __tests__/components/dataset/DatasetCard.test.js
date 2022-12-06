import { render } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import DatasetCard from '../../../components/datasets/DatasetCard'
import { dataset } from './data/DatasetCard'

mockNextUseRouter()

describe('Unit tests for the DatasetCard component', () => {
  describe('Should match snapshot -', () => {
    test('list mode', () => {
      const { container } = render(<DatasetCard dataset={dataset} listType='list' />)
      expect(container).toMatchSnapshot()
    })

    test('card mode', () => {
      const { container } = render(<DatasetCard dataset={dataset} />)
      expect(container).toMatchSnapshot()
    })
  })
})
