import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { FaSliders } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import { PRODUCT_COMPARE_QUERY } from '../shared/query/product'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import BarChart from '../shared/BarChart'
import RadarChart from '../shared/RadarChart'
import Checkbox from '../shared/form/Checkbox'

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
            {format('ui.product.compare.showHighlight')}
          </label>
        </div>
        <div className='flex flex-row'>
          <div className={`py-6 px-4 basis-1/${products.length + 1} grow-0 shrink-0`}>
            <div className='flex flex-col gap-y-3 text-dial-iris-blue'>
              <div className='text-xl font-semibold text-dial-stratos'>
                {format('ui.product.compare.title')}
              </div>
              <a href='#' onClick={toggleFiltering} className='flex gap-x-2'>
                <FaSliders className='text-xl' />
                <div className='text-sm'>Filter comparison</div>
              </a>
            </div>
          </div>
          {products.map((product, productIndex) =>
            <div
              key={productIndex}
              className={classNames(
                `basis-1/${products.length + 1} grow-0 shrink-0`,
                'border-l border-dashed border-dial-slate-500'
              )}
            >
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
                  'border-l border-dashed border-dial-slate-500',
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
