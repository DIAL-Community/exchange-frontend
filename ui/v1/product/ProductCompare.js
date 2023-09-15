import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { PRODUCT_COMPARE_QUERY } from '../shared/query/product'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import BarChart from '../shared/BarChart'
import RadarChart from '../shared/RadarChart'

const ProductDetail = ({ slugs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      create: format('app.create')
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

    return fieldValue
  }

  const renderMaturityField = (maturityDetails) => {
    const MAX_SCORE = 100
    const MIN_RADAR_CATEGORIES = 2
    const chartValues = () =>
      maturityDetails?.map(({ overallScore, maximumScore }) => (overallScore / maximumScore) * MAX_SCORE)

    const chartLabels = () => maturityDetails?.map(({ name }) => name)

    return maturityDetails.length <= MIN_RADAR_CATEGORIES
      ? <BarChart
        labels={chartLabels()}
        values={chartValues()}
        maxScaleValue={MAX_SCORE}
        fontSize={8}
        horizontal
      />
      : <RadarChart
        labels={chartLabels()}
        values={chartValues()}
        maxScaleValue={MAX_SCORE}
        fontSize={8}
      />
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col'>
        {fields.map((field, index) =>
          <div key={index} className='flex flex-row text-sm text-dial-stratos'>
            <div
              className={classNames(
                `basis-1/${products.length + 1} grow-0	shrink-0`,
                index % 2 === 0 && 'bg-dial-slate-300'
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
                  'border-l border-dashed border-dial-slate-500',
                  index % 2 === 0 && 'bg-dial-slate-300'
                )}
              >
                <div className='py-6 px-4'>
                  {field === 'ui.product.rubric.label'
                    ? renderMaturityField(product[field])
                    : renderValueField(product[field])
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
