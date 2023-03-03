import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const FILTER_ITEMS = [
  'filter.entity.useCases', 'filter.entity.buildingBlocks',
  'filter.entity.products'
]

const MAPPED_FILTER_ITEMS_URL = {
  'filter.entity.useCases': 'useCases',
  'filter.entity.buildingBlocks': 'buildingBlocks',
  'filter.entity.products': 'products'
}

const TabNav = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const activeTab = FILTER_ITEMS.indexOf(props.activeTab)

  return (
    <>
      <div className='hidden md:block bg-white max-w-catalog mx-auto z-30'>
        <div className='w-full'>
          <ul className='flex flex-row mb-0 list-none pt-2 gap-x-2'>
            {
              FILTER_ITEMS.map((filterItem, index) => {

                return (
                  <li
                    key={`menu-${filterItem}`}
                    className={`
                      -mb-px whitespace-nowrap
                      ${index === activeTab ? 'bg-dial-yellow rounded-t' : 'pb-2 overflow-hidden'}
                    `}
                    style={{ flex: '1 1 0px' }}
                  >
                    <Link href={`/frame?activeTab=${MAPPED_FILTER_ITEMS_URL[filterItem]}`}>
                      <a
                        className={`
                          block px-3 py-3
                          ${index === activeTab ? 'bg-dial-yellow rounded-t' : 'bg-dial-alice-blue rounded'}
                        `}
                        data-toggle='tab'
                        href={`/frame?activeTab=${MAPPED_FILTER_ITEMS_URL[filterItem]}`}
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
      <div className='hidden md:block md:sticky-bar filter card-drop-shadow-lg'>
        <div className='border-b-8 border-dial-yellow max-w-catalog mx-auto' />
      </div>
    </>
  )
}

export default TabNav
