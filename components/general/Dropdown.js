import { useState, createRef } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { createPopper } from '@popperjs/core'

const Dropdown = ({ title, itemList, onChangeValue }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)
  const [dropdownValue, setDropdownValue] = useState(title)
  const btnDropdownRef = createRef()
  const popoverDropdownRef = createRef()

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, { placement: 'bottom' })
    setDropdownPopoverShow(true)
  }
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false)
  }
  return (
    <>
      <a
        className={`flex justify-between rounded-sm bg-dial-gray-light py-2 ${dropdownValue === title ? 'text-button-gray-light' : 'text-button-gray'} pr-1 focus:outline-none ease-linear transition-all duration-150`}
        ref={btnDropdownRef}
        onClick={() => { dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover() }}
      >
        <div className='ml-2'>
          {dropdownValue}
        </div>
        <HiChevronDown className='mt-1 mr-2 float-right' />
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') + 'bg-dial-gray-light ' +
          'z-50 float-left py-2 list-none text-left rounded-sm shadow-lg mt-2'
        }
        style={{ width: 'inherit' }}
      >
        {itemList.map((item) => {
          return (
            <a
              href='#' key={item} className='block px-3 py-1 text-button-gray hover:bg-dial-gray'
              onClick={(e) => {
                e.preventDefault()
                closeDropdownPopover()
                setDropdownValue(item)
                onChangeValue(item)
              }}
            >{item}
            </a>
          )
        })}
      </div>
    </>
  )
}

export default Dropdown
