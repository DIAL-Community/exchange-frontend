import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ProductCard from '../../product/ProductCard'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { DisplayType } from '../../utils/constants'
import DpiResourceFilter from './DpiResourceFilter'

const DpiCountryDetail = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-6'>
      <div className='report-section'>
        <div className='text-lg text-center'>
          {format('dpi.topic.reports')}
        </div>
        <DpiResourceFilter />
        <div className='grid grid-cols-3 gap-8'>
          {country.resources.map((resource, index) =>
            <ResourceCard key={index} resource={resource} displayType={DisplayType.DPI_CARD}  />
          )}
        </div>
      </div>
      <div className='product-section'>
        <div className='text-lg text-center py-12'>
          {format('ui.product.header')}
        </div>
        <div className='grid grid-cols-3 gap-8'>
          {country.products.map((product, index) =>
            <ProductCard key={index} product={product} displayType={DisplayType.SMALL_CARD}  />
          )}
        </div>
      </div>
    </div>
  )
}

export default DpiCountryDetail
