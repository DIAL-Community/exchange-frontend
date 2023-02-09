import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { FILTER_ITEMS, MAPPED_FILTER_ITEMS_URL } from '../context/FilterContext'

const TabNav = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const activeTab = FILTER_ITEMS.indexOf(props.activeTab)

  return (
    <>
      <div className='hidden md:block bg-white sticky sticky-under-header max-w-catalog mx-auto'>
        <div className='pl-2 pr-4 py-1'>
          <div className='invisible xl:visible max-w-1/2'>
            <div className='px-5 mt-3 py-2 border-t border-r border-l border-gray-300 rounded-t' />
            <div className='text-center -mt-7' style={{ lineHeight: 0.1 }}>
              <span className='bg-white px-3 intro-overview-sdg-framework'>
                <span className='text-sm font-bold text-gray-500'>{format('digiInvestment.title')}</span>
                <HiQuestionMarkCircle className='ml-1 inline' data-tip={format('digiInvestment.tooltip')} data-html />
              </span>
            </div>
          </div>
          <div className='text-right -mt-4'>
            <Link href='/wizard'>
              <a
                href='/navigate-to-wizard'
                className='text-sm border-b-2 border-transparent text-dial-yellow font-bold hover:border-dial-yellow'
              >
                {format('filter.launchWizard')}
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className='hidden md:block relative md:sticky bg-white md:sticky-filter max-w-catalog mx-auto'>
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
                    className={`
                      -mb-px whitespace-nowrap
                      ${index === activeTab ? 'bg-dial-yellow rounded-t' : 'pb-2 overflow-hidden'}
                    `}
                    style={{ flex: '1 1 0px' }}
                  >
                    <Link href={`/${href}`}>
                      <a
                        className={`
                          block px-3 py-3
                          ${index === activeTab ? 'bg-dial-yellow rounded-t' : 'bg-dial-gray-light rounded'}
                        `}
                        data-toggle='tab'
                        href={`/${href}`}
                      >
                        <div
                          className={`
                            ${index === activeTab ? '' : 'truncate'}
                            ${filterItem === 'filter.entity.products' ? 'intro-overview-entity-product' : ''}
                            ${filterItem === 'filter.entity.playbooks' ? 'intro-overview-entity-playbook' : ''}
                            text-center font-semibold text-dial-gray-dark
                          `}
                        >
                          {format(filterItem)}
                        </div>
                      </a>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className='hidden md:block md:sticky md:sticky-bar filter card-drop-shadow-lg'>
        <div className='border-b-8 border-dial-yellow max-w-catalog mx-auto' />
      </div>
    </>
  )
}

export default TabNav
