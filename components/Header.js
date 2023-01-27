import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../lib/hooks'
import { ToastContext } from '../lib/ToastContext'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../queries/user'
import MobileMenu from './MobileMenu'
import AdminMenu from './shared/menu/AdminMenu'
import UserMenu from './shared/menu/UserMenu'
import ResourceMenu from './shared/menu/ResourceMenu'
import AboutMenu from './shared/menu/AboutMenu'
import HelpMenu from './shared/menu/HelpMenu'
import LanguageMenu from './shared/menu/LanguageMenu'
import { NONE } from './shared/menu/MenuCommon'

const dropdownMenuStyles = `
    block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900
  `

const Header = ({ isOnAuthPage = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { showToast } = useContext(ToastContext)

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

  const toggleMenu = () => {
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
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [currentOpenMenu])

  const { data: dataUserToken } = useQuery(USER_AUTHENTICATION_TOKEN_CHECK_QUERY, {
    variables: {
      userId: user?.id,
      userAuthenticationToken: user?.userToken
    },
    skip: !user,
  })

  if (dataUserToken?.userAuthenticationTokenCheck === false) {
    showToast(
      format('user.tokenExpired'),
      'error',
      'top-center',
      5000,
      null,
      () => {
        signOut({ redirect: false })
        signIn()
      },
    )
  }

  return (
    <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-dial-sapphire'>
      <div className='flex flex-wrap py-3 lg:py-0 header-min-height max-w-catalog mx-auto'>
        <div className='flex flex-1 my-auto'>
          <Link href='/'>
            <a className='px-4 xl:px-8'>
              <img src='/assets/2023-refresh/exchange-logo.png' alt='Digital Impact Exchage Logo.' />
            </a>
          </Link>
        </div>
        <label htmlFor='menu-toggle' className='ml-auto my-auto pointer-cursor block lg:hidden px-8'>
          <svg
            className='fill-current text-gray-900'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
          >
            <title>{format('app.menu')}</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </label>
        <input className='hidden' type='checkbox' id='menu-toggle' checked={menuExpanded} onChange={toggleMenu} />
        <div className='hidden lg:flex lg:items-center lg:w-auto w-full ml-auto mx-2' id='menu'>
          <nav>
            <MobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
            <ul className='hidden lg:flex items-center text-dial-blue-darkest pt-4 lg:pt-0 sm:gap-x-6 lg:gap-x-2'>
              {!isOnAuthPage
                && (
                  <>
                    <li className='relative mt-2 lg:mt-0 text-right'>
                      <ResourceMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                    </li>
                    <li className='relative mt-2 lg:mt-0 text-right'>
                      <AboutMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                    </li>
                    {
                      user
                        ? (
                          <>
                            <li className='relative mt-2 lg:mt-0 text-right intro-overview-signup'>
                              {isAdminUser &&
                                <AdminMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                              }
                            </li>
                            <li className='relative mt-2 lg:mt-0 text-right intro-overview-signup'>
                              <UserMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                            </li>
                          </>
                        ) : (
                          <li className='relative mt-2 lg:mt-0 text-right intro-overview-signup'>
                            <a
                              data-testid='login'
                              href='signin'
                              role='menuitem'
                              className={dropdownMenuStyles}
                              onClick={signInUser}
                            >
                              {format('header.signIn')}
                            </a>
                          </li>
                        )
                    }
                    <li className='relative mt-2 lg:mt-0 text-right'>
                      <HelpMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
                    </li>
                    <li><div className='border border-gray-400 border-t-0 lg:border-l-0 lg:h-9' /></li>
                  </>)}
              <li className='relative mt-2 lg:mt-0 text-right'>
                <LanguageMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
