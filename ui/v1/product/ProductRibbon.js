import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Ribbon from '../shared/Ribbon'
import MobileFilter from '../shared/MobileFilter'
import ProductFilter from './fragments/ProductFilter'

const ProductRibbon = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleImage =
    <img
      src='/ui/v1/product-header.svg'
      alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
      width={70}
      height={70}
      className='object-contain'
    />

  const mobileFilter =
    <MobileFilter
      bgColor='bg-dial-spearmint'
      iconColor='text-dial-meadow'
      entityFilter={<ProductFilter />}
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-spearmint'
      titleImage={titleImage}
      titleKey={'ui.product.header'}
      titleColor='text-dial-meadow'
      mobileFilter={mobileFilter}
    />
  )
}

export default ProductRibbon
