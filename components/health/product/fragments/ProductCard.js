import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../context/ProductFilterContext'
import Checkbox from '../../../shared/form/Checkbox'
import { DisplayType } from '../../../utils/constants'
import { isValidFn } from '../../../utils/utilities'

const ProductCard = ({ displayType, product, dismissHandler, urlPrefix = null }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { comparedProducts } = useContext(ProductFilterContext)
  const { setComparedProducts } = useContext(ProductFilterDispatchContext)

  const textRef = useRef(null)
  const [lineClamp, setLineClamp] = useState(0)

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

  useEffect(() => {
    const adjustLineClamp = () => {
      if (textRef.current) {
        const element = textRef.current
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10)
        let height = element.offsetHeight - 10

        if (height > 79) {
          height = 79
        }

        if (height < 79 && height > 48) {
          height = 60
        }

        const lines = Math.floor(height / lineHeight)

        setLineClamp(lines)
      }
    }

    adjustLineClamp()
  }, [])

  const displayGridCard = () =>
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg border-3 border-transparent hover:border-dial-sunshine'>
      <div
        className='bg-white shadow-lg rounded-xl h-360 border border-dial-gray hover:border-transparent'>
        <div className="flex flex-col h-full">
          <div className="flex justify-center items-center py-12 bg-white rounded-xl
                          border-health-red border-4 mx-4 my-4 max-h-[180px]"
          >
            {product.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-12 mx-16">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain"
                />
              </div>
            }
            {product.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain dial-meadow-filter"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold m-auto text-health-blue title-truncate">
            {product.name}
          </div>
          <div className="text-xs text-dial-stratos font-medium h-full overflow-hidden" ref={textRef}>
            <div className="px-6 py-2 flex  mx-auto gap-2">
              <span
                className="my-auto text-center m-auto dynamic-truncate"
                style={{
                  WebkitLineClamp: lineClamp
                }}
              >
                {product.parsedDescription}
              </span>
            </div>
          </div>
          <div className="text-xs text-dial-stratos font-semibold">
            {
              product?.softwareCategories[0]?.name &&
                <div className="px-4 flex gap-2 align-end">
                  <span className="mb-3 mx-auto">
                    <div className="rounded-full bg-health-red uppercase shadow-none px-6 py-1 text-white text-xs">
                      <div className="line-clamp-1">{product?.softwareCategories[0]?.name}</div>
                    </div>
                  </span>
                </div>
            }
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
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
        <div className='text-sm font-semibold my-auto text-dial-plum line-clamp-2'>
          {product.name}
        </div>
      </div>
    </div>

  return (
    <div className="relative">
      <Link href={`${urlPrefix ? urlPrefix : ''}/products/${product.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      <div className="absolute top-2 right-2">
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
