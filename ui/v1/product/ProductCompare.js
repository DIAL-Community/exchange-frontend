import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import { useQuery } from '@apollo/client'
import { PRODUCT_COMPARE_QUERY } from '../shared/query/product'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'

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

  const compareFields = [
    'ui.sector.label',
    'product.license',
    'ui.buildingBlock.label',
    'ui.product.rubric.label',
    'ui.product.project.count',
    'ui.useCase.label',
    'ui.sdg.label'
  ]

  const renderFieldValue = (fieldValue) => {
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

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col'>
        {compareFields.map((compareField, index) =>
          <div key={index} className='flex flex-row'>
            <div
              className={classNames(
                'basis-1/4 shrink-0',
                index % 2 === 0 && 'bg-dial-slate-300'
              )}
            >
              <div className='py-6 px-4'>
                {format(compareField)}
              </div>
            </div>
            {products.map((product, productIndex) =>
              <div
                key={productIndex}
                className={classNames(
                  'basis-1/4 shrink-0',
                  'border-l border-dashed border-dial-slate-500',
                  index % 2 === 0 && 'bg-dial-slate-300'
                )}
              >
                <div className='py-6 px-4 text-sm text-dial-stratos'>
                  {renderFieldValue(product[compareField])}
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
