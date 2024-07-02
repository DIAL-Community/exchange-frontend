import { useCallback } from 'react'
import classNames from 'classnames'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaArrowRightFromBracket, FaGears, FaTowerBroadcast, FaUser, FaUserGroup } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

const HubAdminTabs = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { pathname } = useRouter()

  const  tabItems = [
    {
      name: format('dpi.admin.profile'),
      href: '/hub/admin/profile',
      icon: <FaUser className='my-auto' />
    },
    {
      name: format('dpi.admin.users'),
      href: '/hub/admin/users',
      icon: <FaUserGroup className='my-auto' />
    },
    {
      name: format('dpi.admin.broadcast'),
      href: '/hub/admin/broadcasts',
      icon: <FaTowerBroadcast className='my-auto' />
    },
    {
      name: format('dpi.admin.settings'),
      href: '/hub/admin/settings',
      icon: <FaGears className='my-auto' />
    },
    {
      name: format('dpi.admin.signOut'),
      handler: (event) => {
        event.preventDefault()
        signOut({ callbackUrl: '/' })
      },
      icon: <FaArrowRightFromBracket className='my-auto' />
    }
  ]

  return (
    <ul className="flex-column space-y space-y-4 text-sm font-medium text-dial-slate-300 md:me-4 mb-4 md:mb-0">
      {tabItems.map((item, index) => {
        return item.href
          ? (
            <li key={`tab-${index}`}>
              <Link href={item.href} key={index}
                className={classNames(
                  'inline-flex items-center px-4 py-3 rounded-lg w-full',
                  pathname === item.href
                    ? 'text-dial-cotton active bg-dial-iris-blue'
                    : 'bg-dial-slate-800 hover:bg-dial-slate-700 hover:text-dial-cotton'
                )}
              >
                <div className='flex gap-2'>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            </li>
          )
          : (
            <li key={`tab-${index}`}>
              <a href="#" onClick={item.handler} key={index}
                className={classNames(
                  'inline-flex items-center px-4 py-3 rounded-lg w-full',
                  pathname === item.href
                    ? 'text-dial-cotton active bg-dial-iris-blue'
                    : 'bg-dial-slate-800 hover:bg-dial-slate-700 hover:text-dial-cotton'
                )}
              >
                <div className='flex gap-2'>
                  {item.icon}
                  {item.name}
                </div>
              </a>
            </li>
          )
      })}
    </ul>
  )
}

export default HubAdminTabs
