import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'
import { useProductOwnerUser, useUser } from '../../../../lib/hooks'
import ProductDetailSectors from './ProductDetailSectors'

const ProductDetailHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const { isProductOwner } = useProductOwnerUser(product)
  const canEdit = isAdminUser || isEditorUser || isProductOwner

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
            <a
              href={prependUrlWithProtocol(product.website)}
              target='_blank'
              rel='noreferrer'
              className='flex border-b border-dial-iris-blue '>
              <div className='line-clamp-1'>
                {product.website}
              </div>
            </a>
            &nbsp;⧉
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
        <ProductDetailSectors product={product} canEdit={canEdit} />
      </div>
    </div>
  )
}

export default ProductDetailHeader
