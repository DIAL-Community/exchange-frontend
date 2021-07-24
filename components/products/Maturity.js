import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useIntl } from 'react-intl'

const MaturityCategory = ({ category }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
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
                    {indicator.description}
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
  const format = (id) => formatMessage({ id })
  return (
    <>
      <div className='pb-5 mr-6 h4'>{format('product.overall-score')}: {overallScore} / 100</div>
      <Accordion allowMultipleExpanded allowZeroExpanded>
        {maturityScores.map((category, i) => {
          if (category.overall_score > 0) {
            return (<MaturityCategory key={i} category={category} />)
          }
          return <div key={i} />
        })}
      </Accordion>
    </>
  )
}

export default RubricAccordion
