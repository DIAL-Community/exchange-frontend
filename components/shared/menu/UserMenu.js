import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { USER_MENU } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const UserMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const userName = user.name.toUpperCase()

  const buttonRef = useRef()
  const popoverRef = useRef()

  const signOutUser = (e) => {
    e.preventDefault()
    signOut()
  }

  const toggleSwitcher = (e) => {
    e.preventDefault()
    onToggleDropdown(USER_MENU)
  }

  return (
    <>
      <a
        id={USER_MENU}
        href={USER_MENU}
        data-testid='user-menu'
        className={`
          lg:p-3 px-0 block border-b-2 border-transparent hover:border-dial-yellow
          lg:mb-0 mb-2 inline bg-dial-yellow-light py-2 rounded
        `}
        ref={buttonRef}
        onClick={toggleSwitcher}
      >
        <img src='/icons/user.svg' className='inline mx-2' alt={format('user.iconImage')} height='20px' width='20px' />
        <div id={USER_MENU} className='inline text-xs'>
          {userName}
          {
            currentOpenMenu === USER_MENU
              ? <HiChevronUp className='ml-1 inline text-2xl' />
              : <HiChevronDown className='ml-1 inline text-2xl' />
          }
        </div>
      </a>
      {
        currentOpenMenu === USER_MENU &&
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={popoverRef} role='menu'>
            <Link href='/auth/profile'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.profile')}
              </a>
            </Link>
            <a href='signOut' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES} onClick={signOutUser}>
              {format('header.signOut')}
            </a>
          </div>
      }
    </>
  )
}

export default UserMenu
