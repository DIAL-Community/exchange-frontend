import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { USER_MENU } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const UserMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const userName = user.userName.toUpperCase()

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
        ref={buttonRef}
        onClick={toggleSwitcher}
      >
        <div id={USER_MENU} className="username-avatar">
          <span className="text-dial-gray-dark">
            {userName.substring(0, 2)}
          </span>
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
