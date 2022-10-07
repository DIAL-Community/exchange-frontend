import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useCallback, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import Dialog from '../shared/Dialog'

const MaturityCategory = ({ category }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const numIndicators = category.indicator_scores.length

  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className='h5 inline'>{category.name}</div>
          <div className='h5 float-right inline'>{format('product.category-score')}: {Math.round(category.overall_score * 10)} / 100</div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {category.indicator_scores.map((indicator, i) => {
          let indicatorScore = Math.round(indicator.score * numIndicators * 10)
          indicatorScore = indicatorScore > 100 ? 100 : indicatorScore

          return (
            <Accordion key={i} allowMultipleExpanded allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className='h5 inline'>{indicator.name}</div>
                    <div className='h5 float-right inline'>{format('product.indicator-score')}: {indicatorScore} / 100</div>
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

const RubricAccordion = ({ maturityScores, overallScore }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isMaturityScoreDetailsDialogOpen, setIsMaturityScoreDetailsDialogOpen] = useState(false)
  const toggleMaturityScoreDetailsDialog = () => setIsMaturityScoreDetailsDialogOpen(!isMaturityScoreDetailsDialogOpen)

  return (
    <>
      <div className='pb-5 mr-6 h4'>{format('product.overall-score')}: {overallScore} / 100</div>
      <div className='cursor-pointer bg-dial-gray h-32'
        data-tip={format('product.maturity-chart-tooltip')}
        onClick={toggleMaturityScoreDetailsDialog}
      >
        Maturity spider chart placeholder
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
          <Accordion allowMultipleExpanded allowZeroExpanded className='max-h-[60vh] pb-10 overflow-auto'>
            {maturityScores
              .filter(({ overall_score }) => overall_score > 0)
              .map((category, categoryIdx) => <MaturityCategory key={categoryIdx} category={category} />)
            }
          </Accordion>
        </div>
      </Dialog>
    </>
  )
}

export default RubricAccordion
