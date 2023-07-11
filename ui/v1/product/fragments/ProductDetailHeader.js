import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { prependUrlWithProtocol } from '../../utils/utilities'

const ProductDetailHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {product.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        {product.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='inline'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
              className='object-contain w-20 h-20'
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
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('product.license')}
          </div>
          <div className='flex text-dial-stratos'>
            {product.commercialProduct
              ? format('product.pricing.commercial').toUpperCase()
              : (product.mainRepository?.license || format('general.na')).toUpperCase()
            }
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.sector.header')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {product.sectors.map((sector, index) => {
              return <div key={index}>{sector.name}</div>
            })}
          </div>
        </div>
      </div>
      <hr className='bg-slate-200'/>
      <div className='flex flex-col gap-y-4'>
        <div className='text-xs'>
          If you are the owner of this product, you can update this product information.
        </div>
        <div className='flex text-xs text-dial-stratos'>
          <a
            href={`https://docs.dial.community/projects/product-registry/${locale}/latest/product_owner.html`}
            target='_blank'
            rel='noreferrer'
          >
            <div className='border-b border-dial-iris-blue'>
              Find more information here ⧉
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailHeader
