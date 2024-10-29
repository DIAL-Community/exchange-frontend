import { useCallback, useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { SiteSettingContext } from '../context/SiteSettingContext'
import AdminMenu from './menu/AdminMenu'
import GenericMenu from './menu/GenericMenu'
import HelpMenu from './menu/HelpMenu'
import LanguageMenu from './menu/LanguageMenu'
import { NONE } from './menu/MenuCommon'
import UserMenu from './menu/UserMenu'
import MobileMenu from './MobileMenu'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from './query/user'

const dropdownMenuStyles = classNames(
  'px-3 py-2',
  'text-white hover:text-slate-600',
  'hover:bg-dial-menu-hover rounded-md'
)

const Header = ({ isOnAuthPage = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user } = useUser()
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
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    },
    skip: !user,
    onCompleted: (data) => {
      if (data?.userAuthenticationTokenCheck === false) {
        signOut({ redirect: false })
        signIn()
      }
    }
  })

  const { exchangeLogoUrl, menuConfigurations } = useContext(SiteSettingContext)

  return (
    <header className='z-50 sticky top-0 bg-dial-sapphire max-w-catalog mx-auto'>
      <div className='flex flex-wrap header-min-height px-4 lg:px-8 xl:px-56 text-sm'>
        <Link href='/' className='my-auto'>
          <img
            className='object-center object-contain max-h-16 w-auto'
            src={exchangeLogoUrl ? `//${exchangeLogoUrl}` : '/ui/v1/exchange-logo.svg'}
            alt={format('ui.image.logoAlt', { name: 'Digital Impact Exchange' })}
          />
        </Link>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        {!isOnAuthPage &&
          <ul className='hidden md:flex items-center ml-auto text-dial-white-beech gap-x-3'>
            {menuConfigurations.map((menuConfiguration) => {
              switch (menuConfiguration.type) {
                case 'menu.item':
                case 'menu':
                  return <li key={menuConfiguration.id} className='relative text-right'>
                    <GenericMenu
                      menuConfiguration={menuConfiguration}
                      currentOpenMenu={currentOpenMenu}
                      onToggleDropdown={toggleDropdownSwitcher}
                    />
                  </li>
                case 'locked.help.menu':
                  return <li key={menuConfiguration.id} className='relative text-right'>
                    <HelpMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                  </li>
                case 'locked.language.menu':
                  return <li key={menuConfiguration.id} className='relative text-right'>
                    <LanguageMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                  </li>
                case 'locked.login.menu':
                  return user
                    ? <li key='logged-in-menu' className='relative text-right intro-signup'>
                      <UserMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                    </li>
                    : <li key='sign-in-menu' className='text-right intro-signup'>
                      <a href='signIn' role='menuitem' className={dropdownMenuStyles} onClick={signInUser}>
                        {format('header.signIn')}
                      </a>
                    </li>
                case 'locked.admin.menu':
                  return user && user?.isAdminUser
                    ? <li key='user-admin-menu' className='relative text-right'>
                      <AdminMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                    </li>
                    : null
                default:
                  return null
              }
            })}
          </ul>
        }
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

export default Header
