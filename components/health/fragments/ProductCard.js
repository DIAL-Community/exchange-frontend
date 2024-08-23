import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../context/ProductFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { DisplayType } from '../../utils/constants'
import { isValidFn } from '../../utils/utilities'

const ProductCard = ({ displayType, product, dismissHandler, urlPrefix = null }) => {
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

  const displayGridCard = () =>
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg border-3 border-transparent hover:border-dial-sunshine'>
      <div
        className='bg-white shadow-lg rounded-lg h-full border border-dial-gray hover:border-transparent'>
        <div className="flex flex-col">

          <div className="flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg">
            <div className="px-4 text-sm text-center font-semibold m-auto">
              {product.name}
            </div>
          </div>
          <div className="mx-auto py-6">
            <img
              className="object-contain h-20 w-20"
              layout="fill"
              alt={format('image.alt.logoFor', { name: product.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            />
          </div>
          <hr/>
          <div className="text-xs text-dial-stratos font-semibold">
            <div className="px-4 py-2 flex gap-2">
              <span className="my-auto text-truncate-3">
                {product.parsedDescription}
              </span>
            </div>
          </div>
          <hr/>
          <div className="text-xs text-dial-stratos font-semibold uppercase">
            <div className="px-4 py-2 flex gap-2">
              <span className="badge-avatar w-7 h-7">
                {product.softwareCategories?.length}
              </span>
              <span className="my-auto">
                {product.softwareCategories?.length
                  ? product.softwareCategories[0].name
                  : format('ui.category.header')
                }
              </span>
            </div>
          </div>
          <hr/>
          <div className="text-xs text-dial-stratos font-semibold uppercase">
            <div className="px-4 py-3 flex gap-2">
              <span className="my-auto">
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
    <div className="relative">
      <Link href={`${urlPrefix ? urlPrefix : ''}/products/${product.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
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
