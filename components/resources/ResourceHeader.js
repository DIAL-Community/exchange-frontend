import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import AdminMenu from '../shared/menu/AdminMenu'
import HelpMenu from '../shared/menu/HelpMenu'
import LanguageMenu from '../shared/menu/LanguageMenu'
import MarketplaceMenu from '../shared/menu/MarketplaceMenu'
import { NONE } from '../shared/menu/MenuCommon'
import UserMenu from '../shared/menu/UserMenu'
import MobileMenu from '../shared/MobileMenu'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../shared/query/user'
import ResourceMenu from './menu/ResourceMenu'

const dropdownMenuStyles = classNames(
  'px-3 py-2',
  'text-white hover:text-slate-600',
  'hover:bg-dial-menu-hover rounded-md'
)

const ResourceHeader = ({ isOnAuthPage = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user, isAdminUser } = useUser()
  const signInUser = (e) => {
    e.preventDefault()
    process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0'
      ? signIn('Auth0', { callbackUrl: process.env.NEXT_PUBLIC_API_URL })
      : signIn()
  }

  const [menuExpanded, setMenuExpanded] = useState(false)
  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const toggleDropdownSwitcher = (expectedMenuItem) => {
    setCurrentOpenMenu(currentOpenMenu === expectedMenuItem ? NONE : expectedMenuItem)
  }

  const toggleMobileMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  useEffect(() => {
    const handleClick = (e) => {
      const event = e || window.event
      const target = event.target || event.srcElement
      const closestAnchor = target.closest('a')
      if (closestAnchor) {
        const id = closestAnchor.getAttribute('id')
        if (!id || (id !== currentOpenMenu && currentOpenMenu !== NONE)) {
          setCurrentOpenMenu(NONE)
        }
      }

      if (!closestAnchor) {
        const closestSvg = target.closest('svg')
        if (!closestSvg) {
          setCurrentOpenMenu(NONE)
        } else {
          const id = closestSvg.getAttribute('id')
          if (!id || (`svg-down-${currentOpenMenu}` !== id && `svg-up-${currentOpenMenu}` !== id)) {
            setCurrentOpenMenu(NONE)
          }
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [currentOpenMenu])

  useQuery(USER_AUTHENTICATION_TOKEN_CHECK_QUERY, {
    variables: {
      userId: user?.id,
      userAuthenticationToken: user?.userToken
    },
    skip: !user,
    onCompleted: (data) => {
      if (data?.userAuthenticationTokenCheck === false) {
        signOut({ redirect: false })
        signIn()
      }
    }
  })

  const withUser =
    <>
      <li className='relative text-right'>
        {isAdminUser &&
          <AdminMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
        }
      </li>
      <li className='relative text-right intro-overview-signup'>
        <UserMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
      </li>
    </>

  const withoutUser =
    <li className='text-right intro-overview-signup intro-signup'>
      <a
        href='signIn'
        role='menuitem'
        className={dropdownMenuStyles}
        onClick={signInUser}
      >
        {format('header.signIn')}
      </a>
    </li>

  return (
    <header className='z-50 sticky top-0 bg-dial-sapphire max-w-catalog mx-auto'>
      <div className='flex flex-wrap header-min-height px-4 lg:px-8 xl:px-56 text-sm'>
        <Link href='/' className='my-auto'>
          <img
            className='object-center object-contain'
            src='/ui/v1/exchange-logo.svg'
            alt={format('ui.image.logoAlt', { name: 'Digital Impact Exchange' })}
          />
        </Link>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        <ul className='hidden md:flex items-center ml-auto text-dial-white-beech gap-x-3'>
          {!isOnAuthPage &&
            <>
              <li className='relative text-right intro-marketplace'>
                <MarketplaceMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
              </li>
              <li className='relative text-right intro-tools'>
                <ResourceMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
              </li>
              <li className='text-right'>
                <Link
                  href='/resources'
                  role='menuitem'
                  className='px-1 py-2 cursor-pointer border-b border-transparent hover:border-dial-sunshine'
                >
                  {format('header.knowledgeHub')}
                </Link>
              </li>
              { user ? withUser : withoutUser }
              <li className='relative text-right'>
                <HelpMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
              </li>
            </>
          }
          <li className='relative text-right'>
            <LanguageMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
          </li>
        </ul>
      </div>
      <MobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
    </header>
  )
}

const HamburgerMenu = ({ menuExpanded, onMenuClicked }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <>
      <label
        htmlFor='burger'
        className='ml-auto my-auto cursor-pointer block md:hidden z-30'
      >
        <svg
          className='fill-current text-white'
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 20 20'
        >
          <title>{format('app.menu')}</title>
          <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
        </svg>
      </label>
      <input
        id='burger'
        type='checkbox'
        className='hidden'
        checked={menuExpanded}
        onChange={onMenuClicked}
      />
    </>
  )
}

export default ResourceHeader
