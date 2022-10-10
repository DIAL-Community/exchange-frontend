import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useCallback, useMemo, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import Dialog from '../shared/Dialog'
import RadarChart from '../shared/RadarChart'

const MATURITY_SCORE_MULTIPLIER = 10
const MAX_MATURITY_SCORE = 100

const MaturityCategory = ({ category }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className='h5 inline'>{category.name}</div>
          <div className='h5 float-right inline'>
            {format('product.category-score')}: {Math.round(category.overall_score * MATURITY_SCORE_MULTIPLIER)} / {MAX_MATURITY_SCORE}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {category.indicator_scores.map((indicator, indicatorIdx) => {
          let indicatorScore = Math.round(indicator.score * category.indicator_scores.length * MATURITY_SCORE_MULTIPLIER)
          indicatorScore = indicatorScore > MAX_MATURITY_SCORE ? MAX_MATURITY_SCORE : indicatorScore

          return (
            <Accordion key={indicatorIdx} allowMultipleExpanded allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className='h5 inline'>{indicator.name}</div>
                    <div className='h5 float-right inline'>
                      {format('product.indicator-score')}: {indicatorScore} / {MAX_MATURITY_SCORE}
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className='text-sm text-button-gray pl-6'>
                    {parse(indicator.description)}
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          )
        })}
      </AccordionItemPanel>
    </AccordionItem>
  )
}

const ProductDetailMaturityScores = ({ maturityScores, overallMaturityScore }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const [isMaturityScoreDetailsDialogOpen, setIsMaturityScoreDetailsDialogOpen] = useState(false)
  const toggleMaturityScoreDetailsDialog = () => setIsMaturityScoreDetailsDialogOpen(!isMaturityScoreDetailsDialogOpen)

  const validMaturityScores = useMemo(() => maturityScores.filter(({ overall_score }) => overall_score > 0), [maturityScores])

  const radarChartAxes = useMemo(() => validMaturityScores.map(({ name }) => name), [validMaturityScores])

  const radarChartValues = useMemo(() => validMaturityScores.map(({ overall_score }) => overall_score * MATURITY_SCORE_MULTIPLIER), [validMaturityScores])

  return (
    <div className='mt-12'>
      <div className='card-title mb-3 text-dial-gray-dark'>{format('product.maturity-scores')}</div>
      {validMaturityScores.length ? (
        <>
          <div className='text-sm mb-3 text-dial-gray-dark highlight-link' dangerouslySetInnerHTML={{ __html: format('product.maturity-desc') }} />
          <div className='pb-5 mr-6 h4' data-testid='maturity-overall-score'>
            {format('product.overall-score')}: {overallMaturityScore} / {MAX_MATURITY_SCORE}
          </div>
          <div
            className='cursor-pointer min-h-[20rem] h-[25vh]'
            data-tip={format('product.maturity-chart-tooltip')}
            onClick={toggleMaturityScoreDetailsDialog}
            data-testid='maturity-scores-chart'
          >
            <RadarChart title={format('product.maturity-scores')} axes={radarChartAxes} values={radarChartValues} maxScaleValue={MAX_MATURITY_SCORE} />
          </div>
          <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
          <Dialog
            isOpen={isMaturityScoreDetailsDialogOpen}
            onClose={toggleMaturityScoreDetailsDialog}
            closeButton
          >
            <div className='flex flex-col w-full'>
              <div className='h4 inline mb-2'>
                {format('product.maturity-details-label')}
              </div>
              <Accordion allowMultipleExpanded allowZeroExpanded className='max-h-[60vh] overflow-auto'>
                {validMaturityScores.map((category, categoryIdx) => <MaturityCategory key={categoryIdx} category={category} />)}
              </Accordion>
            </div>
          </Dialog>
        </>
      ) : <div className='text-sm pb-5 text-button-gray'>{format('product.no-maturity')}</div>}
    </div>
  )
}

export default ProductDetailMaturityScores
