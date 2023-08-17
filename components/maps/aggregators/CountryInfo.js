import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

const CountryInfo = (props) => {
  const { country } = props

  const router = useRouter()
  const [active, setActive] = useState(country?.aggregators[0].slug)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Just return empty fragment when there's no country selected.
  if (!country) {
    return null
  }

  const openDetailPage = (e, slug) => {
    e.preventDefault()
    router.push(`/organizations/${slug}`)
  }

  const toggleExpand = (e, slug) => {
    e.preventDefault()
    setActive(active === slug ? 'undefined' : slug)
  }

  return (
    <div className='absolute left-4 md:left-auto right-4' style={{ zIndex: 19, minWidth: '20ch' }}>
      <div
        className={`
          block mt-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5
          focus:outline-none max-w-prose overflow-auto max-h-96
        `}
      >
        <div className='text-sm text-dial-cyan font-semibold border-b px-4 py-2'>
          {`${country.aggregators.length} ${format('ui.aggregator.header')} in ${country.name}`}
        </div>
        {
          country && country.aggregators.map(aggregator => {
            return (
              <div key={`${country.name}-${aggregator.name}`} className='hover:bg-gray-100 hover:text-gray-900'>
                <div className='mx-4 py-2 border-b last:border-0'>
                  <a
                    href={`expand-${aggregator.slug}`}
                    onClick={(e) => toggleExpand(e, aggregator.slug)}
                    className={`
                      ${active === aggregator.slug ? 'font-semibold' : ''}
                      text-sm text-gray-700 cursor-pointer block
                    `}
                  >
                    {aggregator.name}
                  </a>
                  {
                    active === aggregator.slug &&
                      <a
                        href={aggregator.slug}
                        onClick={(e) => openDetailPage(e, aggregator.slug)}
                        className={`
                          block py-1.5 text-center text-xs text-dial-blue
                          bg-dial-blue-light bg-opacity-20 cursor-pointer
                        `}
                      >
                        {format('map.aggregators.viewAggregator')} &gt;&gt;
                      </a>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default CountryInfo
