import Link from 'next/link'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { FILTER_ITEMS, MAPPED_FILTER_ITEMS_URL } from '../context/FilterContext'

const TabNav = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const activeTab = FILTER_ITEMS.indexOf(props.activeTab)

  return (
    <>
      <div className='hidden md:block bg-white sticky sticky-under-header max-w-catalog mx-auto'>
        <div className='px-2 py-1'>
          <div className='text-sm text-dial-sunshine text-right'>
            <Link
              href='/#wizard-anchor'
              scroll={false}
              className='border-b-2 border-transparent font-semibold hover:border-dial-sunshine'
            >
              {format('filter.launchWizard')}
            </Link>
          </div>
        </div>
      </div>
      <div className='hidden md:block md:sticky bg-white md:sticky-filter max-w-catalog mx-auto z-30'>
        <div className='w-full'>
          <ul className='flex flex-row mb-0 list-none pt-2 gap-x-2'>
            {
              FILTER_ITEMS.map((filterItem, index) => {
                let href = MAPPED_FILTER_ITEMS_URL[filterItem]
                if (href.indexOf('map') >= 0) {
                  href = `${href}/projects`
                }

                return (
                  <li
                    key={`menu-${filterItem}`}
                    className={classNames(
                      'whitespace-nowrap',
                      index === activeTab ? 'bg-dial-sunshine rounded-t' : 'pb-2 overflow-hidden'
                    )}
                    style={{ flex: '1 1 0px' }}
                  >
                    <Link
                      href={`/${href}`}
                      className={classNames(
                        'block p-3',
                        index === activeTab
                          ? 'bg-dial-sunshine rounded-t hover:bg-dial-sunshine'
                          : 'bg-dial-alice-blue rounded hover:bg-dial-eggshell'
                      )}
                      data-toggle='tab'
                    >
                      <div
                        className={classNames(
                          index === activeTab ? '' : 'truncate',
                          filterItem === 'filter.entity.products' ? 'intro-overview-entity-product' : '',
                          filterItem === 'filter.entity.playbooks' ? 'intro-overview-entity-playbook' : '',
                          'text-center font-semibold text-dial-gray-dark'
                        )}
                      >
                        {format(filterItem)}
                      </div>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className='hidden md:block md:sticky md:sticky-bar filter shadow-md-lg'>
        <div className='border-b-8 border-dial-sunshine max-w-catalog mx-auto' />
      </div>
    </>
  )
}

export default TabNav
