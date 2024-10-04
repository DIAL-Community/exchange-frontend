import parse from 'html-react-parser'
import Link from 'next/link'
import { useCallback, useContext } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../context/FilterContext'
import Checkbox from '../shared/form/Checkbox'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ProductCard = ({ displayType, index, product, dismissHandler, urlPrefix = null }) => {
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

  const displayGridCard = () =>
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg border-3 border-transparent hover:border-dial-sunshine'>
      <div
        className='bg-white shadow-lg rounded-lg h-full border border-dial-gray hover:border-transparent'>
        <div className='flex flex-col'>

          <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {product.name}
            </div>
          </div>
          <div className='mx-auto py-6'>
            <img
              className='object-contain h-20 w-20'
              layout='fill'
              alt={format('image.alt.logoFor', { name: product.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            />
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {product.sustainableDevelopmentGoals?.length}
              </span>
              <span className='my-auto'>
                {product.sustainableDevelopmentGoals?.length > 1
                  ? format('sdg.shortHeader')
                  : format('sdg.shortLabel')
                }
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {product.buildingBlocks.length}
              </span>
              <span className='my-auto'>
                {product.buildingBlocks.length > 1
                  ? format('ui.buildingBlock.header')
                  : format('ui.buildingBlock.label')
                }
              </span>
              {product.linkedWithDpi &&
                <div className='opacity-50 ml-auto my-auto'>
                  {format('buildingBlock.category.dpi')}
                </div>
              }
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-3 flex gap-2'>
              <span className='my-auto'>
                {product.commercialProduct
                  ? format('product.pricing.commercial').toUpperCase()
                  : product.mainRepository?.license?.toUpperCase() || format('general.na')
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`${urlPrefix ? urlPrefix : ''}/products/${product.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
        {displayType === DisplayType.HUB_CARD && displayDpiCard()}
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
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
