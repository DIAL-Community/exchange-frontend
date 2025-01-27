import { useCallback, useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { NONE, USER_MENU } from '../../shared/menu/MenuCommon'

const menuStyles = 'py-3 cursor-pointer border-b border-transparent hover:border-dial-sunshine'

const UserMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user } = useUser()

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === USER_MENU ? NONE : USER_MENU)
  }

  return (
    <>
      {user &&
        <li>
          <a
            href='user-menu'
            id={USER_MENU}
            onClick={(e) => {
              e.preventDefault()
              toggleSubMenu()
            }}
          >
            <div className='flex flex-row gap-x-2 mx-8 py-4'>
              <img src='/icons/user.svg' className='inline' alt='Back' height='30px' width='30px' />
              <div className='inline my-auto'>
                {user.userName.toLowerCase()}
              </div>
              {currentMenu === USER_MENU
                ? <RiArrowUpSLine className='text-base inline my-auto' />
                : <RiArrowDownSLine className='text-base inline my-auto' />
              }
            </div>
          </a>
          {currentMenu === USER_MENU &&
            <ul className='px-6'>
              <li>
                <Link href='/profiles/me'>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format('header.profile')}
                  </div>
                </Link>
              </li>
              <li>
                <button type='button' onClick={signOut} className='w-full text-left'>
                  <div className='mx-8 py-4'>
                    {format('header.signOut')}
                  </div>
                </button>
              </li>
            </ul>
          }
        </li>
      }
    </>
  )
}

const HealthMobileMenu = ({ menuExpanded, setMenuExpanded }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const [currentMenu, setCurrentMenu] = useState(NONE)

  const { user } = useUser()

  const hideMenu = () => {
    setMenuExpanded(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuExpanded(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setMenuExpanded])

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-16 right-0 w-full max-w-md hide-mobile-menu'>
          <div className='shadow-lg bg-dial-stratos text-dial-cotton cursor-pointer'>
            <ul className='flex flex-col max-h-[640px] lg:max-h-full overflow-auto gap-4 p-4'>
              {!user &&
                <div className='mx-8 my-4'>
                  <button type='button' className='border border-white rounded-md w-full' onClick={signIn}>
                    <div className='py-2.5'>Login</div>
                  </button>
                </div>
              }
              <li className='relative flex gap-x-2 px-8 py-4 text-lg'>
                <Link href='/health/about' role='menuitem' className={menuStyles}>
                  {format('health.header.about').toUpperCase()}
                </Link>
              </li>
              <li className='relative flex gap-x-2 px-8 py-4 text-lg'>
                <Link href='/health/products' role='menuitem' className={menuStyles}>
                  {format('health.header.products').toUpperCase()}
                </Link>
              </li>
              <li className='relative flex gap-x-2 px-8 py-4 text-lg'>
                <Link href='/health/faq' role='menuitem' className={menuStyles}>
                  {format('health.header.faq').toUpperCase()}
                </Link>
              </li>
              <li className='relative flex gap-x-2 px-8 py-4 text-lg'>
                <Link href='/health/map' role='menuitem' className={menuStyles}>
                  {format('health.header.map').toUpperCase()}
                </Link>
              </li>
              <UserMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default HealthMobileMenu
