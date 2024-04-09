import { useCallback } from 'react'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { useIntl } from 'react-intl'

export const ABOUT_MENU = 'menu-about'
export const ADMIN_MENU = 'menu-admin'
export const HELP_MENU = 'menu-help'
export const LANGUAGE_MENU = 'menu-language'
export const MARKETPLACE_MENU = 'menu-marketplace'
export const RESOURCE_MENU = 'menu-resource'
export const CATALOG_MENU = 'menu-catalog'
export const USER_MENU = 'menu-user'

export const NONE = ''

export const MenuHeader = ({ id, href, title, onToggleDropdown, currentOpenMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const onClickHandler = (e) => {
    e.preventDefault()
    onToggleDropdown(id)
  }

  return (
    <a
      id={id}
      href={href ?? id}
      // Adding pl-1 to balance out the right padding on the chevron icon
      className='pl-1 py-2 cursor-pointer border-b border-transparent hover:border-dial-sunshine'
      onClick={onClickHandler}
    >
      {format(title)}
      {currentOpenMenu === id
        ? <HiChevronUp className='inline text-xl' id={`svg-up-${id}`} />
        : <HiChevronDown className='inline text-xl' id={`svg-down-${id}`} />
      }
    </a>
  )
}
