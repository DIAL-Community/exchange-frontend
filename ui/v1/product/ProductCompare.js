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
    return maturityScoreDetails
      // .filter(({ overallScore }) => overallScore > 0)
      .sort((categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name))
  }

  const [validMaturityScores] = useState(sortMaturityScoreDetails(maturityScoreDetails))

  const chartLabels = () => validMaturityScores?.map(({ name }) => name)
  const chartValues = () => validMaturityScores?.map(({ overallScore, maximumScore }) =>
    (overallScore / maximumScore) * MAX_MATURITY_SCORE
  )

  return (
    <>
      {validMaturityScores?.length
        ? <div className='grid grid-cols-1'>
          <div
            className='cursor-pointer'
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
                  fontSize={8}
                  horizontal
                />
              )
              : (
                <RadarChart
                  labels={chartLabels()}
                  values={chartValues()}
                  maxScaleValue={MAX_MATURITY_SCORE}
                  fontSize={8}
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
        : (
          <div className='px-4 text-sm text-dial-stratos'>
            {format('product.noMaturity')}
          </div>
        )
      }
    </>
  )
}

const ProductCompare = ({ slugs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const fieldNames = [
    'ui.sector.label',
    'product.license',
    'ui.buildingBlock.label',
    'ui.product.rubric.label',
    'ui.product.project.count',
    'ui.useCase.label',
    'ui.sdg.label'
  ]

  const [showFilter, setShowFilter] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [fieldDisplayFlags, setFieldDisplayFlags] = useState(fieldNames.reduce((accumulator , fieldName) => {
    accumulator [fieldName] = true

    return accumulator
  }, {}))

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

  const { compareProducts: { products, intersections: commonValues } } = data

  const slugNameMapping = (() => {
    const map = {
      compare: format('app.compare')
    }

    return map
  })()

  const renderValueField = (fieldValue, fieldName) => {
    const commonValue = commonValues[fieldName]
    if (Array.isArray(fieldValue)) {
      return fieldValue.length <= 0
        ? (
          <div className={classNames(showHighlight && commonValue ? 'opacity-40' : '')}>
            {format('general.na')}
          </div>
        )
        : (
          <div className='flex flex-col gap-y-2'>
            {fieldValue.map((value, index) =>
              <div key={index} className='flex'>
                <span
                  className={classNames(
                    showHighlight && (!commonValue || commonValue.indexOf(value) < 0)
                      ? 'opacity-40'
                      : ''
                  )}
                >
                  {fieldName === 'ui.sdg.label' ? value : `- ${value}`}
                </span>
              </div>
            )}
          </div>
        )
    }

    return (
      <div className={`${commonValue === null && showHighlight ? 'opacity-40' : ''}`}>
        {fieldValue ?? format('general.na')}
      </div>
    )
  }

  const renderMaturityField = (maturityScoreDetails) =>
    <ProductMaturityField maturityScoreDetails={maturityScoreDetails} />

  const toggleHighlight = () => {
    setShowHighlight(!showHighlight)
  }

  const toggleFieldDisplayFlag = (fieldName) => {
    setFieldDisplayFlags(fieldDisplayFlags => {
      const currentFieldDisplayFlags = Object.assign({}, fieldDisplayFlags)
      currentFieldDisplayFlags[fieldName] = !currentFieldDisplayFlags[fieldName]

      return currentFieldDisplayFlags
    })
  }

  const toggleFilterDialog = (e) => {
    e.preventDefault()
    setShowFilter(true)
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
              <a href='#' onClick={toggleFilterDialog} className='flex gap-x-2'>
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
        {fieldNames.map((fieldName, index) =>
          <div key={index} className='flex flex-row text-sm text-dial-stratos w-full'>
            <div
              className={classNames(
                `${fieldDisplayFlags[fieldName] ? '' : 'hidden'}`,
                `basis-1/${products.length + 1} grow-0 shrink-0`,
                index % 2 === 0 && 'bg-dial-slate-100'
              )}
            >
              <div className='py-6 px-4 font-semibold'>
                {format(fieldName)}
              </div>
            </div>
            {products.map((product, productIndex) =>
              <div
                key={productIndex}
                className={classNames(
                `${fieldDisplayFlags[fieldName] ? '' : 'hidden'}`,
                  `basis-1/${products.length + 1} grow-0 shrink-0`,
                  'border-l border-dashed border-dial-slate-300',
                  index % 2 === 0 && 'bg-dial-slate-100'
                )}
              >
                {fieldName === 'ui.product.rubric.label'
                  ? <div className='relative py-6'>
                    {renderMaturityField(product[fieldName])}
                  </div>
                  : <div className='py-6 px-4'>
                    {renderValueField(product[fieldName], fieldName)}
                  </div>
                }
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog isOpen={showFilter} onClose={() => setShowFilter(false)} closeButton>
        <div className='flex flex-col text-sm'>
          <div className='mb-6 font-semibold text-lg'>
            {format('ui.product.comparison.filter')}
          </div>
          {fieldNames.map((fieldName, index) =>
            <label key={index} className='flex gap-x-2 mb-2 items-center self-start'>
              <Checkbox
                className='ring-0 focus:ring-0'
                value={fieldDisplayFlags[fieldName]}
                onChange={() => toggleFieldDisplayFlag(fieldName)}
              />
              {format(fieldName)}
            </label>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default ProductCompare
