import { useCallback, useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import { NONE } from '../../shared/menu/MenuCommon'
import { USER_AUTHENTICATION_TOKEN_CHECK_QUERY } from '../../shared/query/user'
import HubMobileMenu from '../menu/HubMobileMenu'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const HubHeader = ({ isOnAuthPage = false }) => {
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

  return (
    <header className='z-50 sticky top-0 bg-dial-deep-purple max-w-catalog mx-auto'>
      <div className='flex header-min-height px-4 lg:px-8 xl:px-24 3xl:px-56 text-sm'>
        <Link href='/' className='my-auto overflow-hidden'>
          <div className='flex gap-1 text-dial-cotton'>
            <img
              src='/ui/v1/dial-logo-white.svg'
              alt={format('ui.image.logoAlt', { name: 'DIAL' })}
              width={128}
              className='object-contain px-4 border-r'
            />
            <div className='lg:text-base 2xl:text-lg w-[12.5rem] 2xl:w-[16rem] my-auto px-4'>
              {format('hub.header.title')}
            </div>
          </div>
        </Link>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        {!isOnAuthPage &&
          <ul className='hidden md:flex items-center ml-auto text-dial-white-beech gap-x-4'>
            <li className='relative text-right 2xl:text-lg'>
              <Link href='/hub/expert-network' role='menuitem' className={menuStyles}>
                {format('hub.header.adliNetwork').toUpperCase()}
              </Link>
            </li>
            <li className='relative text-right 2xl:text-lg'>
              <div className='border border-white h-full py-4' />
            </li>
            <li className='relative text-right 2xl:text-lg'>
              {user
                ? <Link href='/hub/dashboard' role='menuitem' className={menuStyles}>
                  {format('hub.header.adliMember').toUpperCase()}
                </Link>
                : <button role='menuitem' className={menuStyles} onClick={() => signIn()}>
                  {format('hub.header.adliMember').toUpperCase()}
                </button>
              }
            </li>
          </ul>
        }
      </div>
      <HubMobileMenu menuExpanded={menuExpanded} />
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
          className='fill-current text-dial-cotton'
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

export default HubHeader
