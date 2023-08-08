import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const ProductDetailHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {product.name}
      </div>
      <div className='w-20 h-20'>
        <img
          src='/ui/v1/product-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.candidateProduct.label') })}
          className='object-contain dial-meadow-filter'
        />
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('product.website')}
          </div>
          <div className='flex text-dial-stratos'>
            <a href={prependUrlWithProtocol(product.website)} target='_blank' rel='noreferrer'>
              <div className='border-b border-dial-iris-blue'>
                {product.website} ⧉
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailHeader
