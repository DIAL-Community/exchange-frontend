import Link from 'next/link'
import { useIntl } from 'react-intl'
import { createRef, useCallback, useContext, useState } from 'react'
import { createPopper } from '@popperjs/core'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FilterContext, FILTER_ITEMS, MAPPED_FILTER_ITEMS_URL } from '../context/FilterContext'

const MobileNav = ({ activeTab }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showTabs, setShowTabs] = useState(false)
  const { resultCounts } = useContext(FilterContext)

  const tabPopoverButton = createRef()
  const tabPopover = createRef()

  const openDropdownPopover = (buttonRef, popoverRef, openCallback) => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom-end'
    })
    openCallback(true)
  }

  const closeDropdownPopover = (closeCallback) => {
    closeCallback(false)
  }

  const toggleTabs = (e) => {
    e.preventDefault()
    showTabs
      ? closeDropdownPopover(setShowTabs)
      : openDropdownPopover(tabPopoverButton, tabPopover, setShowTabs)
  }

  return (
    <>
      <div
        className='md:hidden sticky bg-transparent sticky-under-header'
        ref={tabPopoverButton} onClick={toggleTabs}
      >
        <div className='w-full'>
          <div className='whitespace-nowrap bg-dial-yellow flex'>
            <div className='font-semibold text-xl px-3 py-4 text-dial-gray-dark'>
              {format(activeTab)}
              <div className='inline mx-4 py-2 px-2 rounded text-sm text-dial-gray-dark bg-white'>
                {resultCounts[activeTab]}
              </div>
            </div>
            <div className='ml-auto my-auto px-4'>
              {showTabs ? <BsChevronUp size='1.5em' /> : <BsChevronDown size='1.5em' />}
            </div>
          </div>
        </div>
      </div>
      {
        // List of navigations to be shown when you click the div.
      }
      <div
        className={`${showTabs ? 'block' : 'hidden'} border-b-2 border-dial-gray-dark z-30`}
        ref={tabPopover} role='menu'
      >
        <div className='w-screen flex flex-col bg-white' role='none'>
          <div className='w-full'>
            <ul className='flex flex-col gap-2 mb-2 list-none pt-2'>
              {
                FILTER_ITEMS.map((filterItem) => {
                  let href = MAPPED_FILTER_ITEMS_URL[filterItem]
                  if (href.indexOf('map') >= 0) {
                    href = `${href}/projects`
                  }

                  return (
                    <li
                      key={`menu-${filterItem}`}
                      className='mx-2 whitespace-nowrap overflow-hidden'
                    >
                      <Link href={`/${href}`}>
                        <a
                          className='block px-3 py-1 bg-dial-gray rounded'
                          data-toggle='tab' href={`/${href}`}
                        >
                          <div className='font-semibold my-2 mx-1 text-dial-gray-dark'>
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
      </div>
    </>
  )
}

export default MobileNav
