import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const MapTabNav = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const tabNames = {
    'projects': 'map.project.title',
    'endorsers': 'map.endorser.title',
    'aggregators': 'map.aggregator.title'
  }

  const routeContains = (expectedText) => router.pathname.indexOf(expectedText) >= 0

  return (
    <div className='bg-white'>
      <div className='flex flex-row gap-3'>
        <ul className='flex flex-row list-none gap-x-1'>
          {Object.entries(tabNames).map(([key, value]) => {
            return <li
              key={`tab-menu-${key}`}
              className={classNames(
                'rounded-t text-sm',
                routeContains(key)
                  ? 'text-white bg-dial-slate-500'
                  : 'bg-dial-slate-300 text-dial-slate-500'
              )}
            >
              <Link
                href={`/maps/${key}`}
                className='h-full'
              >
                <div className='px-4 py-3 h-full'>
                  {format(value)}
                </div>
              </Link>
            </li>
          })}
        </ul>
      </div>
      <div className='shadow-md-lg'>
        <div className='border-b-8 border-dial-slate-500' />
      </div>
    </div>
  )
}

export default MapTabNav
