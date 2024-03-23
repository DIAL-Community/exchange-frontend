import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ProductCard from '../../product/ProductCard'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { DisplayType } from '../../utils/constants'

const DpiCountryDetail = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col'>
      <div className='bg-dial-slate-200 py-12 px-4'>
        <div className='text-center text-xl'>
          {format('dpi.topic.reports')}
        </div>
        <div className='grid grid-cols-3 gap-8'>
          {country.resources.map((resource, index) =>
            <ResourceCard key={index} resource={resource} displayType={DisplayType.DPI_CARD}  />
          )}
        </div>
      </div>
      <div className='bg-dial-sapphire text-white py-6 px-4'>
        <div className='text-center text-xl'>
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
