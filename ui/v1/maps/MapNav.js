import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const MapNav = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const tabNames = ['projects', 'aggregators', 'endorsers']
  const routeContains = (expectedText) => router.pathname.indexOf(expectedText) >= 0

  return (
    <div className='bg-white z-30'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='flex flex-row gap-3'>
          <ul className='flex flex-row list-none gap-x-1'>
            {tabNames.map((tabName) => {
              return <li
                key={`tab-menu-${tabName}`}
                className={classNames(
                  'rounded-t text-sm',
                  routeContains(tabName)
                    ? 'text-white bg-dial-slate-500'
                    : 'bg-dial-slate-300 text-dial-slate-500'
                )}
              >
                <Link
                  href={`/maps/${tabName}`}
                  className='h-full'
                >
                  <div className='px-4 py-3 h-full'>
                    {format(tabName)}
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
    </div>
  )
}

export default MapNav
