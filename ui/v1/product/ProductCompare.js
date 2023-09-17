import classNames from 'classnames'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useQuery } from '@apollo/client'
import { FaSliders } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'
import { PRODUCT_COMPARE_QUERY } from '../shared/query/product'
import Dialog from '../shared/Dialog'
import BarChart from '../shared/BarChart'
import RadarChart from '../shared/RadarChart'
import Breadcrumb from '../shared/Breadcrumb'
import Checkbox from '../shared/form/Checkbox'
import { Error, Loading, NotFound } from '../shared/FetchStatus'

const MATURITY_SCORE_MULTIPLIER = 10
const MAX_MATURITY_SCORE = 100
const MIN_RADAR_CHART_CATEGORIES = 2

const MaturityCategory = ({ category }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <AccordionItem>
      <AccordionItemHeading className='bg-dial-spearmint text-dial-stratos hover:bg-dial-mint'>
        <AccordionItemButton>
          <div className='inline text-xs uppercase font-semibold'>{category.name}</div>
          <div className='inline text-xs uppercase float-right mt-2'>
            {`
              ${format('product.maturity.categoryScore')}:
              ${Math.round((category.overallScore / category.maximumScore) * MAX_MATURITY_SCORE)} /
              ${MAX_MATURITY_SCORE}
            `}
          </div>
          <div className='text-xs text-justify'>
            {category.description && parse(category.description)}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {category.categoryIndicators.map((indicator, indicatorIdx) => {
          let indicatorScore = Math.round(indicator.score / indicator.weight) * MATURITY_SCORE_MULTIPLIER
          indicatorScore = indicatorScore > MAX_MATURITY_SCORE ? MAX_MATURITY_SCORE : indicatorScore
          const scoreText = `${Math.round(indicatorScore)} / ${MAX_MATURITY_SCORE}`

          return (
            <Accordion key={indicatorIdx} allowMultipleExpanded allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading className='bg-dial-spearmint text-dial-stratos hover:bg-dial-mint'>
                  <AccordionItemButton>
                    <div className='inline text-xs uppercase font-semibold'>{indicator.name}</div>
                    <div className='inline text-xs uppercase float-right mt-2'>
                      {`
                        ${format('product.maturity.indicatorScore')}:
                        ${isNaN(indicatorScore) ? 'N/A' : scoreText}
                      `}
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className='text-sm text-dial-stratos pl-4'>
                    {parse(indicator.description)}
                  </div>
                  <div className='text-sm text-dial-stratos pl-4'>
                    {format('categoryIndicator.weight')}: {indicator.weight}
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

const ProductMaturityField = ({ maturityScoreDetails }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [isMaturityScoreDetailsDialogOpen, setIsMaturityScoreDetailsDialogOpen] = useState(false)
  const toggleMaturityScoreDetailsDialog = () =>
    setIsMaturityScoreDetailsDialogOpen(!isMaturityScoreDetailsDialogOpen)

  const sortMaturityScoreDetails = (maturityScoreDetails) => {
    console.log(maturityScoreDetails)

    return maturityScoreDetails
      .filter(({ overallScore }) => overallScore > 0)
      .sort((categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name))
  }

  const [validMaturityScores] = useState(sortMaturityScoreDetails(maturityScoreDetails))

  const chartLabels = () => validMaturityScores?.map(({ name }) => name)
  const chartValues = () => validMaturityScores?.map(({ overallScore, maximumScore }) =>
    (overallScore / maximumScore) * MAX_MATURITY_SCORE
  )

  return (
    <>
      {console.log(validMaturityScores)}
      {validMaturityScores?.length
        ? <div className='grid grid-cols-1 xl:grid-cols-3 gap-12'>
          <div
            className='xl:col-span-2 cursor-pointer min-h-[20rem] h-[25vh]'
            data-tooltip-id='react-tooltip'
            data-tooltip-content={format('product.maturity.chartTooltip')}
            onClick={toggleMaturityScoreDetailsDialog}
          >
            {validMaturityScores.length <= MIN_RADAR_CHART_CATEGORIES
              ? (
                <BarChart
                  labels={chartLabels()}
                  values={chartValues()}
                  maxScaleValue={MAX_MATURITY_SCORE}
                  fontSize={7}
                  horizontal
                />
              )
              : (
                <RadarChart
                  labels={chartLabels()}
                  values={chartValues()}
                  maxScaleValue={MAX_MATURITY_SCORE}
                  fontSize={7}
                />
              )
            }
          </div>
          <Dialog
            isOpen={isMaturityScoreDetailsDialogOpen}
            onClose={toggleMaturityScoreDetailsDialog}
            closeButton
          >
            <div className='flex flex-col w-full'>
              <div className='h4 inline mb-6'>{format('product.maturity.detailLabel')}</div>
              <Accordion
                allowMultipleExpanded
                allowZeroExpanded
                className='max-h-[60vh] overflow-auto'
              >
                {validMaturityScores?.map((category, categoryIdx) => (
                  <MaturityCategory key={categoryIdx} category={category} />
                ))}
              </Accordion>
            </div>
          </Dialog>
        </div>
        : <div className='text-sm text-dial-stratos'>{format('product.noMaturity')}</div>
      }
    </>
  )
}

const ProductDetail = ({ slugs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showHighlight, setShowHighlight] = useState(false)

  const { loading, error, data } = useQuery(PRODUCT_COMPARE_QUERY, {
    variables: { slugs }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.compareProducts) {
    return <NotFound />
  }

  const { compareProducts: { products } } = data

  const slugNameMapping = (() => {
    const map = {
      compare: format('app.compare')
    }

    return map
  })()

  const fields = [
    'ui.sector.label',
    'product.license',
    'ui.buildingBlock.label',
    'ui.product.rubric.label',
    'ui.product.project.count',
    'ui.useCase.label',
    'ui.sdg.label'
  ]

  const renderValueField = (fieldValue) => {
    if (Array.isArray(fieldValue)) {
      if (fieldValue.length <= 0) {
        return format('general.na')
      } else {
        return (
          <div className='flex flex-col gap-y-2'>
            {fieldValue.map((value, index) =>
              <div key={index} className='flex'>
                {value}
              </div>
            )}
          </div>
        )
      }
    }

    return fieldValue ?? format('general.na')
  }

  const renderMaturityField = (maturityScoreDetails) => {
    return <ProductMaturityField maturityScoreDetails={maturityScoreDetails} />
  }

  const toggleHighlight = () => {
    setShowHighlight(!showHighlight)
  }

  const toggleFiltering = (e) => {
    e.preventDefault()
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col py-8'>
        <div className='flex'>
          <label className='ml-auto flex gap-x-2 text-sm'>
            <Checkbox
              value={showHighlight}
              onChange={toggleHighlight}
              className='ring-0 focus:ring-0'
            />
            {format('ui.product.comparison.showHighlight')}
          </label>
        </div>
        <div className='flex flex-row'>
          <div className={`py-6 px-4 basis-1/${products.length + 1} grow-0 shrink-0`}>
            <div className='flex flex-col gap-y-3 text-dial-iris-blue'>
              <div className='text-xl font-semibold text-dial-stratos'>
                {format('ui.product.comparison.title')}
              </div>
              <a href='#' onClick={toggleFiltering} className='flex gap-x-2'>
                <FaSliders className='text-xl' />
                <div className='text-sm'>
                  {format('ui.product.comparison.filter')}
                </div>
              </a>
            </div>
          </div>
          {products.map((product, productIndex) =>
            <div
              key={productIndex}
              className={classNames(
                `basis-1/${products.length + 1} grow-0 shrink-0`,
                'border-l border-dashed border-dial-slate-300'
              )}
            >
              <a href={`/products/${product.slug}`} target='_blank' rel='noreferrer'>
                <div className='flex flex-col gap-y-3 py-8'>
                  {product.imageFile.indexOf('placeholder.svg') < 0 &&
                    <div className='w-20 h-20 mx-auto bg-white border'>
                      <img
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                        alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                        className='object-contain w-16 h-16 mx-auto my-2'
                      />
                    </div>
                  }
                  {product.imageFile.indexOf('placeholder.svg') >= 0 &&
                    <div className='w-20 h-20 mx-auto'>
                      <img
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                        alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                        className='object-contain w-16 h-16'
                      />
                    </div>
                  }
                  <div className='text-lg font-semibold text-dial-meadow text-center'>
                    {product.name}
                  </div>
                </div>
              </a>
            </div>
          )}
        </div>
        {fields.map((field, index) =>
          <div key={index} className='flex flex-row text-sm text-dial-stratos'>
            <div
              className={classNames(
                `basis-1/${products.length + 1} grow-0	shrink-0`,
                index % 2 === 0 && 'bg-dial-slate-100'
              )}
            >
              <div className='py-6 px-4'>
                {format(field)}
              </div>
            </div>
            {products.map((product, productIndex) =>
              <div
                key={productIndex}
                className={classNames(
                  `basis-1/${products.length + 1} grow-0	shrink-0`,
                  'border-l border-dashed border-dial-slate-300',
                  index % 2 === 0 && 'bg-dial-slate-100'
                )}
              >
                {field === 'ui.product.rubric.label'
                  ? <div className='relative py-6'>{renderMaturityField(product[field])}</div>
                  : <div className='py-6 px-4'>{renderValueField(product[field])}</div>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
