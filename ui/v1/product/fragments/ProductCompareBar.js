import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { FaXmark } from 'react-icons/fa6'
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

  const removeFromComparedProducts = (event, product) => {
    event.preventDefault()
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
              <div className='flex flex-col gap-y-3'>
                <a href='#' onClick={clearCompareBar} className='flex'>
                  <div className='text-white border-b'>
                    {format('ui.product.compare.clear')}
                  </div>
                </a>
                <div className='text-xs text-white italic'>
                  {format('ui.product.compare.hint')}
                </div>
              </div>
              <div className='ml-auto flex flex-row justify-end items-center gap-x-6'>
                {comparedProducts.map((product, index) => (
                  <div key={index} className='relative py-4'>
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
                      <div className='w-20 h-20 flex justify-center items-center bg-white'>
                        <img
                          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                          alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                          className='object-contain w-16 h-16'
                        />
                      </div>
                    }
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                      <a
                        href='#'
                        data-tooltip-id='react-tooltip'
                        data-tooltip-content={format('ui.product.compare.remove')}
                        onClick={(event) => removeFromComparedProducts(event, product)}
                      >
                        <FaXmark size='2.5rem' className='hover:opacity-70 opacity-0' />
                      </a>
                    </div>
                  </div>
                ))}
                <div className='flex items-center'>
                  <button
                    type='button'
                    className='submit-button'
                    onClick={navigateToComparePage}
                    disabled={comparedProducts.length < 2 || comparedProducts.length > 4}
                  >
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
