import { fireEvent } from '@testing-library/dom'
import ProductDetailMaturityScores from '../../../components/products/ProductDetailMaturityScores'
import { mockObserverImplementation, render, waitForAllEffects } from '../../test-utils'
import { mockNextUseRouter } from '../../utils/nextMockImplementation'
import { maturityScore, maturityScores } from './data/ProductDetailMaturityScores'

mockNextUseRouter()

describe('Unit test for the ProductDetailMaturityScores component.', () => {
  const MATURITY_SCORES_CHART_TEST_ID = 'maturity-scores-chart'
  const DIALOG_TEST_ID = 'dialog'

  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot', () => {
    test('maturity scores radar chart.', () => {
      const { getByTestId } = render(
        <ProductDetailMaturityScores
          maturityScores={maturityScores}
          overallMaturityScore={maturityScore}
        />
      )
      expect(getByTestId('maturity-overall-score')).toMatchSnapshot()
      expect(getByTestId(MATURITY_SCORES_CHART_TEST_ID)).toMatchSnapshot()
    })

    test('maturity scores accordion in a dialog.', async () => {
      const { getByTestId } = render(
        <ProductDetailMaturityScores
          maturityScores={maturityScores}
          overallMaturityScore={maturityScore}
        />
      )
      fireEvent.click(getByTestId(MATURITY_SCORES_CHART_TEST_ID))
      await waitForAllEffects(1000)
      expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()
    })
  })
})
