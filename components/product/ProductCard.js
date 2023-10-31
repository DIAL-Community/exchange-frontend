import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'
import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'
import Checkbox from '../shared/form/Checkbox'

const ProductCard = ({ displayType, index, product, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { comparedProducts } = useContext(ProductFilterContext)
  const { setComparedProducts } = useContext(ProductFilterDispatchContext)

  const isInComparedProducts = () => {
    return comparedProducts.filter(p => p.id === product.id).length > 0
  }

  const toggleComparedProducts = () => {
    if (isInComparedProducts()) {
      setComparedProducts(comparedProducts => [...comparedProducts.filter(p => p.id !== product.id)])
    } else {
      setComparedProducts(comparedProducts => [...comparedProducts, product])
    }
  }

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-spearmint'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
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
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-meadow'>
            {product.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {product?.parsedDescription && parse(product?.parsedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdg.header')} ({product.sdgs?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({product.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-product-bg-light to-product-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {product.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full my-auto w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.product.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {product.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.product.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold my-auto text-dial-meadow line-clamp-2'>
          {product.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/products/${product.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      <div className='absolute top-2 right-2'>
        {isValidFn(dismissHandler) &&
          <button type='button'>
            <FaXmark size='1rem' className='text-dial-meadow' onClick={dismissHandler} />
          </button>
        }
        {!isValidFn(dismissHandler) && displayType === DisplayType.LARGE_CARD &&
          <label className='ml-auto flex gap-x-2 text-sm'>
            <Checkbox
              value={isInComparedProducts()}
              onChange={toggleComparedProducts}
              className='ring-0 focus:ring-0'
            />
            {format('ui.product.compare')}
          </label>
        }
      </div>
    </div>
  )
}

export default ProductCard
