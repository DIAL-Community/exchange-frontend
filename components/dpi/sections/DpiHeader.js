import { useCallback, useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { NONE } from '../../shared/menu/MenuCommon'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../../shared/query/user'
import DpiMobileMenu from '../menu/DpiMobileMenu'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const DpiHeader = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user } = useUser()

  const [menuExpanded, setMenuExpanded] = useState(false)
  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

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

  return (
    <header className='z-50 sticky top-0 bg-dial-stratos max-w-catalog mx-auto'>
      <div className='flex flex-wrap header-min-height px-4 lg:px-8 xl:px-56 text-sm'>
        <Link href='/' className='my-auto'>
          <div className='flex gap-1 text-white'>
            <div className='text-xs w-16 my-auto'>{format('dpi.header.title')}</div>
            <img
              src='/ui/v1/dial-logo-yg.svg'
              alt={format('ui.image.logoAlt', { name: 'DIAL' })}
              width={96}
              className='object-contain'
            />
          </div>
        </Link>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        <ul className='hidden md:flex items-center ml-auto text-dial-white-beech gap-x-8'>
          <li className='relative text-right text-lg'>
            <Link href='/dpi-topics' role='menuitem' className={menuStyles}>
              {format('dpi.header.topic')}
            </Link>
          </li>
          <li className='relative text-right text-lg'>
            <Link href='/dpi-countries' role='menuitem' className={menuStyles}>
              {format('dpi.header.country')}
            </Link>
          </li>
          <li className='relative text-right text-lg'>
            <Link href='/dpi-resource-finder' role='menuitem' className={menuStyles}>
              {format('dpi.header.resourceFinder')}
            </Link>
          </li>
        </ul>
      </div>
      <DpiMobileMenu menuExpanded={menuExpanded} />
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

export default DpiHeader
