import { useCallback, useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { NONE } from '../../shared/menu/MenuCommon'
import UserMenu from '../../shared/menu/UserMenu'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../../shared/query/user'
import HealthMobileMenu from '../menu/HealthMobileMenu'
import AdminMenu from '../shared/menu/AdminMenu'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const HealthHeader = ({ isOnAuthPage = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user, isAdminUser } = useUser()

  const [menuExpanded, setMenuExpanded] = useState(false)
  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const signInUser = (e) => {
    e.preventDefault()
    process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0'
      ? signIn('Auth0', { callbackUrl: process.env.NEXT_PUBLIC_API_URL })
      : signIn()
  }

  const toggleMobileMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  const toggleDropdownSwitcher = (expectedMenuItem) => {
    setCurrentOpenMenu(currentOpenMenu === expectedMenuItem ? NONE : expectedMenuItem)
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

  const withUser =
    <>
      <li className="relative text-right">
        {isAdminUser &&
          <AdminMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher}/>
        }
      </li>
      <li className="relative text-right text-lg text-gray intro-signup">
        <UserMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher}/>
      </li>
    </>

  const withoutUser =
    <li className="text-right intro-signup bg-health-blue text-white p-1 rounded-md">
      <a
        href="signIn"
        role="menuitem"
        className='px-3 py-2 text-gray text-lg hover:text-white hover:bg-health-blue rounded-md fi'
        onClick={signInUser}
      >
        {format('header.signIn')}
      </a>
    </li>

  return (
    <header className='z-50 sticky top-0 bg-white max-w-catalog mx-auto shadow-md'>
      <div className='flex flex-wrap header-min-height px-4 lg:px-8 xl:px-56 text-sm'>
        <Link href='/' className='my-auto'>
          <div className='flex gap-1 text-dial-cotton'>
            <img
              src='/ui/health/a-cdc-logo.png'
              alt={format('ui.image.logoAlt', { name: 'Africa CDC' })}
              width={256}
              className='object-contain px-4 w-60'
            />
          </div>
        </Link>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        {!isOnAuthPage &&
          <ul className='hidden md:flex items-center ml-auto text-gray gap-x-8'>
            <li className='relative text-right text-lg'>
              <Link href='/health/products' role='menuitem' className={menuStyles}>
                {format('health.header.products')}
              </Link>
            </li>
            <li className='relative text-right text-lg'>
              <Link href='/health/about' role='menuitem' className={menuStyles}>
                {format('health.header.about')}
              </Link>
            </li>
            <li className='relative text-right text-lg'>
              <Link href='/health/faq' role='menuitem' className={menuStyles}>
                {format('health.header.faq')}
              </Link>
            </li>
            <li className='relative text-right text-lg'>
              <Link href='/health/map' role='menuitem' className={menuStyles}>
                {format('health.header.map')}
              </Link>
            </li>
            { user ? withUser : withoutUser }
          </ul>
        }
      </div>
      <HealthMobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
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
          className='fill-current text-gray'
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

export default HealthHeader
