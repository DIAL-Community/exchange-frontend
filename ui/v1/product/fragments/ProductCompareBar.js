import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import {
  ProductFilterContext,
  ProductFilterDispatchContext
} from '../../../../components/context/ProductFilterContext'

const ProductCompareBar = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { comparedProducts } = useContext(ProductFilterContext)
  const { setComparedProducts } = useContext(ProductFilterDispatchContext)

  const removeFromComparedProducts = (product) => {
    setComparedProducts(comparedProducts => [...comparedProducts.filter(p => p.id !== product.id)])
  }

  const navigateToComparePage = () => {
    const compareQuery = '?' + comparedProducts.map(product => `slugs=${product.slug}`).join('&')
    router.push(`/products/compare${compareQuery}`)
  }

  const clearCompareBar = (e) => {
    e.preventDefault()
    setComparedProducts([])
  }

  return (
    <>
      {comparedProducts.length > 0 &&
        <div class='fixed bottom-0 bg-dial-meadow max-w-catalog w-screen'>
          <div className='px-4 lg:px-8 xl:px-56 text-dial-stratos text-sm'>
            <div className='flex flex-row items-center'>
              <a href='#' onClick={clearCompareBar}>
                <div className='text-white border-b'>
                  {format('ui.product.compare.clear')}
                </div>
              </a>
              <div className='ml-auto flex flex-row justify-end items-center gap-x-6'>
                {comparedProducts.map((product, index) => (
                  <div
                    key={index}
                    className='flex flex-col gap-y-3 py-4 cursor-pointer'
                    onClick={() => removeFromComparedProducts(product)}
                  >
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
                  </div>
                ))}
                <div className='flex items-center'>
                  <button type='button' className='submit-button' onClick={navigateToComparePage}>
                    {format('ui.product.compare')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ProductCompareBar
