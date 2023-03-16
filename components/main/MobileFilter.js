import { createRef, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { createPopper } from '@popperjs/core'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

const MobileFilter = ({ filter, activeTab }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showFilters, setShowFilters] = useState(false)

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
      <div className='xl:hidden sticky bg-dial-solitude '>
        <div className='rounded-b-lg border-b-2 border-dial-white-beech' ref={filterPopoverButton}>
          <div className='flex gap-x-8 py-2 px-4' onClick={toggleTabs}>
            <div className='font-semibold text-sm my-auto'>
              {format('filter.dropdown.title', { entity: format(activeTab) })}
            </div>
            <div className='my-auto ml-auto'>
              {showFilters ? <BsChevronUp size='1em' /> : <BsChevronDown size='1em' />}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${showFilters ? 'block xl:hidden' : 'hidden'} z-20`}
        ref={filterPopover} role='menu'
      >
        {filter}
      </div>
    </>
  )
}

export default MobileFilter
