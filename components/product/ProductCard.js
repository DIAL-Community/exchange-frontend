import { useCallback, useContext } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../context/FilterContext'
import Checkbox from '../shared/form/Checkbox'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ProductCard = ({ disabled, displayType, index, product, dismissHandler, urlPrefix = null }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { comparedProducts } = useContext(FilterContext)
  const { setComparedProducts } = useContext(FilterDispatchContext)

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
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.country.header')} ({product.countries?.length ?? 0})
            </div>
          </div>
          <div className='flex gap-2 text-xs text-white'>
            {product.govStackEntity &&
              <div className='border border-dial-iris-blue text-dial-iris-blue rounded px-6 py-1'>
                {format('govstack.label').toUpperCase()}
              </div>
            }
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

  const displayDpiCard = () =>
    <div className='flex flex-col gap-2'>
      <div className='min-h-[12rem] flex items-center justify-center bg-white'>
        <img
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
          alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
          className='object-contain max-h-[6rem]'
        />
      </div>
      <div className='text-center text-white'>
        {product.name}
      </div>
    </div>

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[24rem]'>
        <div className="flex flex-col h-full">
          <div className='spacer h-6' />
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-spearmint',
                'py-12 mx-4 my-4 max-h-[10rem]'
              )}
          >
            {product.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[5rem] w-[5rem]"
                />
              </div>
            }
            {product.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {product.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium min-h-[5rem]">
            <span className="text-center line-clamp-3">
              {product.parsedDescription && parse(product.parsedDescription)}
            </span>
          </div>
          {(product.commercialProduct || product.mainRepository?.license) &&
            <div className="my-3 mx-auto text-xs font-medium">
              <div className="rounded-full bg-dial-meadow uppercase shadow-none px-6 py-1 text-white">
                {product.commercialProduct
                  ? format('product.pricing.commercial').toUpperCase()
                  : product.mainRepository?.license.toUpperCase()
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link
        href={`${urlPrefix ? urlPrefix : ''}/products/${product.slug}`}
        onClick={(e) => { if (disabled) e.preventDefault() }}
      >
        {displayType === DisplayType.HUB_CARD && displayDpiCard()}
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      <div className='absolute top-2 right-2'>
        {isValidFn(dismissHandler) &&
          <button type='button'>
            <FaXmark size='1rem' className='text-dial-meadow' onClick={dismissHandler} />
          </button>
        }
        {!isValidFn(dismissHandler) && (displayType === DisplayType.LARGE_CARD || displayType === DisplayType.GRID_CARD) &&
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
