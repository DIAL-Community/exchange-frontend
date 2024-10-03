import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

const CountryInfo = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const [active, setActive] = useState(country?.products[0].slug)

  // Just return empty fragment when there's no country selected.
  if (!country) {
    return null
  }

  const openDetailPage = (e, slug) => {
    e.preventDefault()
    router.push(`/health/products/${slug}`)
  }

  const toggleExpand = (e, slug) => {
    e.preventDefault()
    setActive(active === slug ? 'undefined' : slug)
  }

  return (
    <div className='absolute left-4 md:left-auto right-4' style={{ zIndex: 19, minWidth: '20ch' }}>
      <div
        className={`
          block mt-2 shadow-lg bg-white ring-1
          ring-black ring-opacity-5 focus:outline-none
          max-w-prose overflow-auto max-h-96
        `}
      >
        <div className='text-sm text-dial-cyan font-semibold border-b px-4 py-2'>
          {`${country.products.length} ${format('ui.product.header')} in ${country.name}`}
        </div>
        {country && country.products.map(product => {
          return (
            <div key={`${country.name}-${product.name}`} className='hover:bg-gray-100 hover:text-gray-900'>
              <div className='mx-4 py-2 border-b last:border-0'>
                <a
                  href={`expand-${product.slug}`}
                  onClick={(e) => toggleExpand(e, product.slug)}
                  className={`
                    ${active === product.slug ? 'font-semibold' : ''}
                    text-sm text-gray-700 cursor-pointer block
                  `}
                >
                  {product.name}
                </a>
                {active === product.slug &&
                  <a
                    href={product.slug}
                    onClick={(e) => openDetailPage(e, product.slug)}
                    className={`
                      block py-1.5 text-center text-xs text-dial-blue
                      bg-dial-blue-light bg-opacity-20 cursor-pointer
                    `}
                  >
                    {format('map.products.viewProduct')} &gt;&gt;
                  </a>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CountryInfo
