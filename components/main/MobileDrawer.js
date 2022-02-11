import { createRef, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { createPopper } from '@popperjs/core'

import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'

const MobileDrawer = ({ filter, hint, activeTab }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [showFilters, setShowFilters] = useState(false)
  const { openHint } = useContext(FilterContext)

  const filterPopoverButton = createRef()
  const filterPopover = createRef()

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
    showFilters
      ? closeDropdownPopover(setShowFilters)
      : openDropdownPopover(filterPopoverButton, filterPopover, setShowFilters)
  }

  return (

    <>
      <div
        className='md:hidden sticky bg-dial-gray-light max-w-catalog mx-auto border-b-2'
        ref={filterPopoverButton}
      >
        <div className='w-full h-full'>
          <div className='flex gap-x-8 py-1'>
            <div className='font-semibold text-sm px-3 text-dial-gray-dark my-auto'>
              {format('filter.dropdown.title', { entity: format(activeTab) })}
            </div>
            <div className='my-auto' onClick={toggleTabs}>
              {showFilters ? <BsChevronUp size='1.5em' /> : <BsChevronDown size='1.5em' />}
            </div>
          </div>
        </div>
      </div>
      {
        // List of navigations to be shown when you click the div.
      }
      <div
        className={`${showFilters ? 'block md:hidden' : 'hidden'} border-b-2 border-dial-gray z-20 bg-dial-gray-light h-full`}
        ref={filterPopover} role='menu'
      >
        <div className={`card ${openHint ? 'flip-vertical' : ''}`}>
          <div className='card-body'>
            <div className='card-front'>
              {filter}
            </div>
            <div className='card-back flip-vertical'>
              {openHint && hint}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileDrawer
