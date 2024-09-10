import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const ProductDetailHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='flex justify-center items-center py-16 bg-white rounded border-health-red border-4'>
        {product.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
              className='object-contain'
            />
          </div>
        }
        {product.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
              className='object-contain dial-meadow-filter'
            />
          </div>
        }
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        {product.govStackEntity &&
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-meadow'>
              {format('ui.product.source')}
            </div>
            <div className='flex text-dial-stratos'>
              {format('govstack.label')}
            </div>
          </div>
        }
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-black'>
            {format('product.website')}
          </div>
          <div className='flex text-dial-stratos'>
            {product.website ?
              <a
                href={prependUrlWithProtocol(product.website)}
                target='_blank'
                rel='noreferrer'
                className='flex border-b border-dial-iris-blue '>
                <div className='line-clamp-1 break-all'>
                  {product.website}
                </div>
                &nbsp;⧉
              </a>
              : <span className='text-dial-stratos'>{format('general.na').toUpperCase()}</span>
            }
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-black'>
            {format('product.license')}
          </div>
          <div className='flex text-dial-stratos'>
            {product.commercialProduct
              ? format('product.pricing.commercial').toUpperCase()
              : (product.mainRepository?.license || format('general.na')).toUpperCase()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailHeader
