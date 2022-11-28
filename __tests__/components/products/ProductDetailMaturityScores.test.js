import { fireEvent } from '@testing-library/dom'
import ProductDetailMaturityScores from '../../../components/products/ProductDetailMaturityScores'
import { PRODUCT_CATEGORY_INDICATORS_QUERY } from '../../../queries/product'
import { mockObserverImplementation, render, waitForAllEffects } from '../../test-utils'
import CustomMockedProvider, { generateMockApolloData } from '../../utils/CustomMockedProvider'
import { mockNextAuthUseSession, mockNextUseRouter, statuses } from '../../utils/nextMockImplementation'
import { categoryIndicators, maturityScoreDetails, maturityScore } from './data/ProductDetailMaturityScores'

mockNextUseRouter()

describe('Unit test for the ProductDetailMaturityScores component.', () => {
  const MATURITY_SCORES_CHART_TEST_ID = 'maturity-scores-chart'
  const DIALOG_TEST_ID = 'dialog'
  const PRODUCT_SLUG = 'test'
  const EDIT_BUTTON_TEST_ID = 'edit-button'
  const mockCategoryIndicators = generateMockApolloData(PRODUCT_CATEGORY_INDICATORS_QUERY, { slug: PRODUCT_SLUG }, null, categoryIndicators)

  beforeAll(() => {
    window.ResizeObserver = mockObserverImplementation()
    window.IntersectionObserver = mockObserverImplementation()
  })

  describe('Should match snapshot', () => {
    test('maturity scores radar chart.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <ProductDetailMaturityScores
            slug={PRODUCT_SLUG}
            maturityScore={maturityScore}
            maturityScoreDetails={maturityScoreDetails}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      expect(getByTestId('maturity-overall-score')).toMatchSnapshot()
      expect(getByTestId(MATURITY_SCORES_CHART_TEST_ID)).toMatchSnapshot()
    })

    test('maturity scores accordion in a dialog.', async () => {
      const { getByTestId } = render(
        <CustomMockedProvider>
          <ProductDetailMaturityScores
            slug={PRODUCT_SLUG}
            maturityScore={maturityScore}
            maturityScoreDetails={maturityScoreDetails}
          />
        </CustomMockedProvider>
      )
      await waitForAllEffects()
      fireEvent.click(getByTestId(MATURITY_SCORES_CHART_TEST_ID))
      await waitForAllEffects(1000)
      expect(getByTestId(DIALOG_TEST_ID)).toMatchSnapshot()
    })
  })

  test('category indicators accordion in an editable section.', async () => {
    mockNextAuthUseSession(statuses.AUTHENTICATED, { canEdit: true })
    const { getByTestId, container } = render(
      <CustomMockedProvider mocks={[mockCategoryIndicators]}>
        <ProductDetailMaturityScores
          slug={PRODUCT_SLUG}
          maturityScore={maturityScore}
          maturityScoreDetails={maturityScoreDetails}
        />
      </CustomMockedProvider>
    )
    await waitForAllEffects()
    fireEvent.click(getByTestId(EDIT_BUTTON_TEST_ID))
    expect(container).toMatchSnapshot()
  })
})
