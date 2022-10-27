import { useIntl } from 'react-intl'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { forwardRef } from 'react'

export const ABOUT_MENU = 'menu-about'
export const ADMIN_MENU = 'menu-admin'
export const HELP_MENU = 'menu-help'
export const LANGUAGE_MENU = 'menu-language'
export const RESOURCE_MENU = 'menu-resource'
export const USER_MENU = 'menu-user'

export const NONE = ''

export const MenuHeader = forwardRef(({ id, href, title, onToggleDropdown, currentOpenMenu }, ref) => {
  const { formatMessage } = useIntl()

  const onClickHandler = (e) => {
    e.preventDefault()
    onToggleDropdown(id)
  }

  return (
    <a
      id={id}
      href={href ?? id}
      className='lg:p-3 px-0 border-b-2 border-transparent hover:border-dial-yellow lg:mb-0 mb-2 cursor-pointer'
      ref={ref}
      onClick={onClickHandler}
      data-testid={id}
    >
      {formatMessage({ id: title })}
      {
        currentOpenMenu === id
          ? <HiChevronUp className='ml-1 inline text-2xl' />
          : <HiChevronDown className='ml-1 inline text-2xl' />
      }
    </a>
  )
})

MenuHeader.displayName = 'CommonMenuHeader'